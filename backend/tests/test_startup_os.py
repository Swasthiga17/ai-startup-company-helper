import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from database import SessionLocal, init_db
from models.auth_models import User
from routes.auth import create_access_token


def create_test_user(email: str, name: str):
    """Create or fetch a test user and return (user, JWT token)."""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(name=name, email=email, hashed_password="dummy_hash_123")
            db.add(user)
            db.commit()
            db.refresh(user)
        token = create_access_token(subject=str(user.id))
        return user, token
    finally:
        db.close()


class TestStartupOS(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        # httpx.ASGITransport does NOT fire ASGI lifespan events,
        # so we must initialise the DB (create tables) explicitly.
        init_db()
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_startup_command_center_unauthenticated(self):
        """TEST 1: Unauthenticated /startup/command-center returns demo data."""
        response = await self.client.get("/startup/command-center")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("health_score", data)
        self.assertIn("scores", data)

    async def test_2_startup_profile_persistence_and_isolation(self):
        """TEST 2: Profile updates persist, health score recalculates, and data is isolated per user."""
        # User A
        user_a, token_a = create_test_user("user_a@example.com", "User A")
        headers_a = {"Authorization": f"Bearer {token_a}"}

        # User B
        user_b, token_b = create_test_user("user_b@example.com", "User B")
        headers_b = {"Authorization": f"Bearer {token_b}"}

        # Fetch User A profile
        resp_a = await self.client.get("/startup/profile", headers=headers_a)
        self.assertEqual(resp_a.status_code, 200)
        profile_a = resp_a.json()["profile"]

        # Update User A profile name & scores
        update_resp = await self.client.put("/startup/profile", headers=headers_a, json={
            "startup_name": "User A Startup",
            "market_score": 90,
            "product_score": 85
        })
        self.assertEqual(update_resp.status_code, 200)

        # Verify User A profile changes persisted
        resp_a_updated = await self.client.get("/startup/profile", headers=headers_a)
        self.assertEqual(resp_a_updated.status_code, 200)
        updated_profile = resp_a_updated.json()["profile"]
        self.assertEqual(updated_profile["startup_name"], "User A Startup")
        self.assertEqual(updated_profile["scores"]["market"], 90)

        # Health score deterministic: market=90, product=85, revenue=69, competition=81, execution=88
        # (90*.2)+(85*.2)+(69*.2)+(81*.15)+(88*.25) = 18+17+13.8+12.15+22 = 82.95 -> 83
        self.assertEqual(updated_profile["health_score"], 83)

        # Verify User B is isolated and does NOT see User A's data
        resp_b = await self.client.get("/startup/profile", headers=headers_b)
        self.assertEqual(resp_b.status_code, 200)
        profile_b = resp_b.json()["profile"]
        self.assertNotEqual(profile_b["startup_name"], "User A Startup")

    async def test_3_goal_and_task_crud(self):
        """TEST 3: Create goal, list it, create task, complete it, and verify persistence."""
        user, token = create_test_user("founder_crud@example.com", "Founder CRUD")
        headers = {"Authorization": f"Bearer {token}"}

        # Create Goal
        goal_resp = await self.client.post("/startup/goals", headers=headers, json={
            "title": "Reach 500 Leads",
            "category": "GROWTH",
            "target_value": "500 Leads"
        })
        self.assertEqual(goal_resp.status_code, 200)
        goal_id = goal_resp.json()["goal_id"]

        # List Goals and verify the new goal exists
        goals_list = await self.client.get("/startup/goals", headers=headers)
        self.assertEqual(goals_list.status_code, 200)
        self.assertTrue(any(g["id"] == goal_id for g in goals_list.json()["goals"]))

        # Create Task
        task_resp = await self.client.post("/startup/tasks", headers=headers, json={
            "title": "Build Landing Page v2",
            "priority": "HIGH",
            "goal_id": goal_id
        })
        self.assertEqual(task_resp.status_code, 200)
        task_id = task_resp.json()["task_id"]

        # Complete Task
        patch_resp = await self.client.patch(f"/startup/tasks/{task_id}?status_str=COMPLETED", headers=headers)
        self.assertEqual(patch_resp.status_code, 200)

        # List Tasks and check completed status
        tasks_list = await self.client.get("/startup/tasks", headers=headers)
        self.assertEqual(tasks_list.status_code, 200)
        target_task = next(t for t in tasks_list.json()["tasks"] if t["id"] == task_id)
        self.assertEqual(target_task["status"], "COMPLETED")


if __name__ == "__main__":
    unittest.main()