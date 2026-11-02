import os
import sys
import unittest
from unittest.mock import AsyncMock, patch
import httpx
import socketio.exceptions
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from database import SessionLocal, init_db
from models.auth_models import User, Notification
from routes.auth import create_access_token, hash_password
from socket_server import (
    sio,
    connect,
    disconnect,
    join_room,
    join_workspace,
    send_user_notification,
    authenticated_sessions,
    extract_token,
    verify_jwt_token,
)


class TestPhase26NotificationSecurity(unittest.IsolatedAsyncioTestCase):

    @classmethod
    def setUpClass(cls):
        init_db()
        db: Session = SessionLocal()

        # User A
        cls.user_a_email = "p0_03_user_a@audit.com"
        u_a = db.query(User).filter(User.email == cls.user_a_email).first()
        if not u_a:
            u_a = User(name="User A", email=cls.user_a_email, hashed_password=hash_password("PassUserA123!"))
            db.add(u_a)
            db.commit()
            db.refresh(u_a)
        cls.user_a_id = u_a.id

        # User B
        cls.user_b_email = "p0_03_user_b@audit.com"
        u_b = db.query(User).filter(User.email == cls.user_b_email).first()
        if not u_b:
            u_b = User(name="User B", email=cls.user_b_email, hashed_password=hash_password("PassUserB123!"))
            db.add(u_b)
            db.commit()
            db.refresh(u_b)
        cls.user_b_id = u_b.id

        db.close()

        cls.token_a = create_access_token(subject=str(cls.user_a_id))
        cls.headers_a = {"Authorization": f"Bearer {cls.token_a}"}

        cls.token_b = create_access_token(subject=str(cls.user_b_id))
        cls.headers_b = {"Authorization": f"Bearer {cls.token_b}"}

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_01_authenticated_notification_retrieval(self):
        """1. Authenticated user can retrieve their notifications and unread count."""
        db: Session = SessionLocal()
        n = Notification(
            user_id=self.user_a_id,
            title="Setup Done",
            message="Your cofounder workspace is ready.",
            type="info",
            read=False,
        )
        db.add(n)
        db.commit()
        db.close()

        res = await self.client.get("/notifications", headers=self.headers_a)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("notifications", data)
        self.assertIn("unread_count", data)
        self.assertGreaterEqual(data["unread_count"], 1)

        found = any(item["title"] == "Setup Done" for item in data["notifications"])
        self.assertTrue(found, "User A should see their own notification")

    async def test_02_unauthenticated_retrieval_blocked(self):
        """2. Unauthenticated notification retrieval is blocked (401)."""
        res_no_auth = await self.client.get("/notifications")
        self.assertEqual(res_no_auth.status_code, 401)

        res_bad_auth = await self.client.get(
            "/notifications", headers={"Authorization": "Bearer invalid.jwt.token"}
        )
        self.assertEqual(res_bad_auth.status_code, 401)

    async def test_03_authenticated_notification_creation(self):
        """3. Authenticated notification creation (/notifications/push) succeeds and associates user_id."""
        payload = {
            "title": "Analysis Ready",
            "message": "Market size and competitor report generated.",
            "type": "success",
        }
        res = await self.client.post("/notifications/push", json=payload, headers=self.headers_a)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        notif = data["notification"]
        self.assertEqual(notif["user_id"], self.user_a_id)
        self.assertEqual(notif["title"], payload["title"])
        self.assertEqual(notif["message"], payload["message"])
        self.assertFalse(notif["read"])

        # Verify persisted in database
        db: Session = SessionLocal()
        db_n = db.query(Notification).filter(Notification.id == notif["id"]).first()
        self.assertIsNotNone(db_n)
        self.assertEqual(db_n.user_id, self.user_a_id)
        db.close()

    async def test_04_unauthenticated_push_blocked(self):
        """4. Unauthenticated push creation is blocked (401)."""
        payload = {"title": "Spam", "message": "Unauthorized push", "type": "warning"}
        res = await self.client.post("/notifications/push", json=payload)
        self.assertEqual(res.status_code, 401)

        res_bad = await self.client.post(
            "/notifications/push",
            json=payload,
            headers={"Authorization": "Bearer fake_token"},
        )
        self.assertEqual(res_bad.status_code, 401)

    async def test_05_user_isolation_retrieval(self):
        """5. User A cannot retrieve User B's notifications, and vice versa."""
        db: Session = SessionLocal()
        n_a = Notification(
            user_id=self.user_a_id,
            title="Private Notif for A",
            message="Confidential to User A",
            type="info",
        )
        n_b = Notification(
            user_id=self.user_b_id,
            title="Private Notif for B",
            message="Confidential to User B",
            type="warning",
        )
        db.add_all([n_a, n_b])
        db.commit()
        db.close()

        # Check User A's view
        res_a = await self.client.get("/notifications", headers=self.headers_a)
        self.assertEqual(res_a.status_code, 200)
        data_a = res_a.json()
        titles_a = [n["title"] for n in data_a["notifications"]]
        self.assertIn("Private Notif for A", titles_a)
        self.assertNotIn("Private Notif for B", titles_a)

        # Check User B's view
        res_b = await self.client.get("/notifications", headers=self.headers_b)
        self.assertEqual(res_b.status_code, 200)
        data_b = res_b.json()
        titles_b = [n["title"] for n in data_b["notifications"]]
        self.assertIn("Private Notif for B", titles_b)
        self.assertNotIn("Private Notif for A", titles_b)

    async def test_06_user_cannot_delete_other_user_notification(self):
        """6. User A cannot delete User B's notification (returns 403)."""
        db: Session = SessionLocal()
        notif_b = Notification(
            user_id=self.user_b_id,
            title="User B Delete Target",
            message="Must not be deleted by User A",
            type="info",
        )
        db.add(notif_b)
        db.commit()
        db.refresh(notif_b)
        target_id = notif_b.id
        db.close()

        # User A attempts to delete User B's notification
        res = await self.client.delete(f"/notifications/{target_id}", headers=self.headers_a)
        self.assertEqual(res.status_code, 403)
        err_msg = res.json().get("error") or res.json().get("detail", "")
        self.assertIn("Access denied", err_msg)

        # Verify notification still exists in DB
        db2: Session = SessionLocal()
        still_exists = db2.query(Notification).filter(Notification.id == target_id).first()
        self.assertIsNotNone(still_exists)
        db2.close()

    async def test_07_database_persistence_across_sessions(self):
        """7. Notifications persist in the database across session/restart boundaries."""
        db1: Session = SessionLocal()
        persisted = Notification(
            user_id=self.user_a_id,
            title="Persistence Check",
            message="Preserved across backend restarts in SQLite.",
            type="success",
        )
        db1.add(persisted)
        db1.commit()
        db1.refresh(persisted)
        pid = persisted.id
        db1.close()  # Simulate session close / backend process stop

        # Fresh session simulates restart
        db2: Session = SessionLocal()
        reloaded = db2.query(Notification).filter(Notification.id == pid).first()
        self.assertIsNotNone(reloaded)
        self.assertEqual(reloaded.title, "Persistence Check")
        self.assertEqual(reloaded.user_id, self.user_a_id)
        db2.close()

    async def test_08_read_unread_status_updates(self):
        """8. Read/unread status updates work and prevent cross-user modifications."""
        db: Session = SessionLocal()
        n = Notification(
            user_id=self.user_a_id,
            title="Unread Alert",
            message="Click to mark as read.",
            type="info",
            read=False,
        )
        db.add(n)
        db.commit()
        db.refresh(n)
        nid = n.id
        db.close()

        # User B attempts to mark User A's notification as read -> 403
        res_cross = await self.client.patch(f"/notifications/{nid}/read", headers=self.headers_b)
        self.assertEqual(res_cross.status_code, 403)

        # User A marks their own notification as read -> 200
        res_a = await self.client.patch(f"/notifications/{nid}/read", headers=self.headers_a)
        self.assertEqual(res_a.status_code, 200)
        self.assertTrue(res_a.json()["notification"]["read"])

        # Check DB reflects change
        db2: Session = SessionLocal()
        db_check = db2.query(Notification).filter(Notification.id == nid).first()
        self.assertTrue(db_check.read)
        db2.close()

    async def test_09_socket_io_authentication(self):
        """9. Socket.IO connection authentication allows valid JWT and rejects unauthenticated connections."""
        # 1. Valid auth via dict
        sid_valid = "sid_test_valid_auth"
        await connect(sid_valid, {}, auth={"token": self.token_a})
        self.assertIn(sid_valid, authenticated_sessions)
        self.assertEqual(authenticated_sessions[sid_valid]["user_id"], self.user_a_id)

        # 2. Valid auth via query string
        sid_qs = "sid_test_qs"
        await connect(sid_qs, {"QUERY_STRING": f"token={self.token_b}"}, auth=None)
        self.assertIn(sid_qs, authenticated_sessions)
        self.assertEqual(authenticated_sessions[sid_qs]["user_id"], self.user_b_id)

        # 3. Missing auth token rejected with ConnectionRefusedError
        with self.assertRaises(socketio.exceptions.ConnectionRefusedError):
            await connect("sid_anon", {}, auth=None)

        # 4. Invalid auth token rejected with ConnectionRefusedError
        with self.assertRaises(socketio.exceptions.ConnectionRefusedError):
            await connect("sid_invalid", {}, auth={"token": "bad.token.signature"})

        # Clean up
        await disconnect(sid_valid)
        await disconnect(sid_qs)
        self.assertNotIn(sid_valid, authenticated_sessions)
        self.assertNotIn(sid_qs, authenticated_sessions)

    async def test_10_socket_io_user_room_isolation(self):
        """10. Push notifications are emitted strictly to the user's isolated room."""
        notification_payload = {
            "id": 999,
            "user_id": self.user_a_id,
            "title": "Confidential Push",
            "message": "Only for User A room",
            "type": "info",
        }

        with patch.object(sio, "emit", new_callable=AsyncMock) as mock_emit:
            await send_user_notification(self.user_a_id, notification_payload)

            mock_emit.assert_awaited_once()
            args, kwargs = mock_emit.call_args
            self.assertEqual(args[0], "push_notification")
            self.assertEqual(args[1], notification_payload)
            self.assertEqual(kwargs.get("room"), f"user_{self.user_a_id}")
            self.assertNotEqual(kwargs.get("room"), f"user_{self.user_b_id}")

    async def test_11_unauthorized_room_subscription_blocked(self):
        """11. Users cannot subscribe to another user's private notification room."""
        sid_a = "sid_test_user_a_isolation"
        authenticated_sessions[sid_a] = {"user_id": self.user_a_id, "token": self.token_a}

        # Attempt to join another user's private room
        res_room = await join_room(sid_a, {"room": f"user_{self.user_b_id}"})
        self.assertEqual(res_room["status"], "error")
        self.assertIn("Unauthorized", res_room["message"])

        # Attempt to join another user's room via workspace event
        res_ws = await join_workspace(sid_a, {"workspace_id": f"user_{self.user_b_id}"})
        self.assertEqual(res_ws["status"], "error")
        self.assertIn("Unauthorized", res_ws["message"])

        # Legitimate join to own room succeeds
        res_own = await join_room(sid_a, {"room": f"user_{self.user_a_id}"})
        self.assertEqual(res_own["status"], "success")

        await disconnect(sid_a)

    async def test_12_frontend_api_compatibility_and_clear(self):
        """12. Existing frontend notification contract is maintained and bulk clear is user-isolated."""
        # Create a notification via push
        push_res = await self.client.post(
            "/notifications/push",
            json={"title": "Contract Test", "message": "Verifying UI fields", "type": "warning"},
            headers=self.headers_a,
        )
        self.assertEqual(push_res.status_code, 200)
        notif_item = push_res.json()["notification"]

        # Ensure all fields expected by Notifications.jsx and PushToast.jsx are present
        expected_fields = ["id", "user_id", "title", "message", "type", "read", "timestamp", "text", "time"]
        for field in expected_fields:
            self.assertIn(field, notif_item, f"Missing frontend field {field}")

        # Ensure User B also has at least one notification
        await self.client.post(
            "/notifications/push",
            json={"title": "User B Item", "message": "Should not be cleared by User A", "type": "info"},
            headers=self.headers_b,
        )

        # User A calls DELETE /notifications (clear all for User A)
        del_res = await self.client.delete("/notifications", headers=self.headers_a)
        self.assertEqual(del_res.status_code, 200)
        self.assertEqual(del_res.json()["status"], "success")

        # User A's list should now have unread_count 0
        get_a = await self.client.get("/notifications", headers=self.headers_a)
        self.assertEqual(get_a.json()["unread_count"], 0)

        # User B's notification should still exist and not be cleared
        get_b = await self.client.get("/notifications", headers=self.headers_b)
        self.assertGreaterEqual(len(get_b.json()["notifications"]), 1)
        titles_b = [n["title"] for n in get_b.json()["notifications"]]
        self.assertIn("User B Item", titles_b)


if __name__ == "__main__":
    unittest.main()
