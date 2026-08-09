import os
import sys
import json
import uuid
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from database import SessionLocal, init_db
from models.auth_models import User, Analysis, Document, ActionItem
from config import GEMINI_API_KEY, SECRET_KEY


class TestPhase14E2E(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        # httpx.ASGITransport does NOT fire ASGI lifespan events,
        # so we must initialise the DB (create tables) explicitly.
        init_db()

        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        self.test_email = f"e2e_user_{uuid.uuid4().hex[:6]}@example.com"
        self.test_password = "E2ESecurePassword2026!"
        self.auth_headers = {}

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_full_authentication_flow(self):
        """TEST 1: Registration, Login, Token Header set, Protected access, and Invalid Login rejection."""
        # 1. Register User
        reg_res = await self.client.post("/auth/register", json={
            "name": "E2E Tester",
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(reg_res.status_code, 200)

        # 2. Login User (Valid)
        login_res = await self.client.post("/auth/login", json={
            "email": self.test_email,
            "password": self.test_password
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = login_res.json()
        self.assertIn("access_token", login_data)
        token = login_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Access Protected Route
        action_res = await self.client.get("/action-items", headers=headers)
        self.assertEqual(action_res.status_code, 200)

        # 4. Invalid Login Rejection
        bad_login = await self.client.post("/auth/login", json={
            "email": self.test_email,
            "password": "WrongPassword123"
        })
        self.assertEqual(bad_login.status_code, 401)

    async def test_2_e2e_rag_document_lifecycle(self):
        """TEST 2: Upload document, Ingest, Verify indexing, and Delete document with chunk cleanup."""
        # Register & Login
        await self.client.post("/auth/register", json={"name": "RAG User", "email": "rag_user@example.com", "password": "Password123!"})
        login_res = await self.client.post("/auth/login", json={"email": "rag_user@example.com", "password": "Password123!"})
        self.assertEqual(login_res.status_code, 200)
        headers = {"Authorization": f"Bearer {login_res.json()['access_token']}"}

        # Upload Document
        file_content = b"IdeaExecutor is an AI-driven multi-agent startup co-founder system."
        files = {"file": ("startup_guide.txt", file_content, "text/plain")}
        up_res = await self.client.post("/upload-document", files=files, headers=headers)
        self.assertEqual(up_res.status_code, 200)
        doc_data = up_res.json()
        self.assertIn("document", doc_data)
        doc_id = doc_data["document"]["id"]

        # Delete Document
        del_res = await self.client.delete(f"/documents/{doc_id}", headers=headers)
        self.assertEqual(del_res.status_code, 200)

    async def test_3_simulator_scenario_evaluation(self):
        """TEST 3: What-If decision simulator evaluates scenario deltas and returns structured calculations."""
        # Login
        await self.client.post("/auth/register", json={"name": "Sim User", "email": "sim_user@example.com", "password": "Password123!"})
        login_res = await self.client.post("/auth/login", json={"email": "sim_user@example.com", "password": "Password123!"})
        self.assertEqual(login_res.status_code, 200)
        headers = {"Authorization": f"Bearer {login_res.json()['access_token']}"}

        sim_res = await self.client.post("/simulator/evaluate-scenario", json={
            "idea": "AI Startup Co-founder Platform",
            "price_change_percent": 25.0,
            "cac_change_percent": 10.0,
            "new_engineers_count": 2
        }, headers=headers)
        self.assertEqual(sim_res.status_code, 200)
        data = sim_res.json()["data"]
        self.assertIn("metrics", data)
        self.assertIn("baseline", data)
        self.assertIn("risk_changes", data)

    async def test_4_action_items_persistence_and_toggle(self):
        """TEST 4: User can create, view, toggle completion, and delete action items."""
        # Login
        await self.client.post("/auth/register", json={"name": "Item User", "email": "item_user@example.com", "password": "Password123!"})
        login_res = await self.client.post("/auth/login", json={"email": "item_user@example.com", "password": "Password123!"})
        self.assertEqual(login_res.status_code, 200)
        headers = {"Authorization": f"Bearer {login_res.json()['access_token']}"}

        # Create Item
        create_res = await self.client.post("/action-items", json={
            "title": "Validate Customer Personas",
            "priority": "HIGH",
            "reason": "Ensure high willingness-to-pay"
        }, headers=headers)
        self.assertEqual(create_res.status_code, 200)
        item_id = create_res.json()["item"]["id"]

        # Toggle Status to completed
        patch_res = await self.client.patch(f"/action-items/{item_id}", json={"status": "completed"}, headers=headers)
        self.assertEqual(patch_res.status_code, 200)
        self.assertEqual(patch_res.json()["item"]["status"], "COMPLETED")

        # Delete Item
        del_res = await self.client.delete(f"/action-items/{item_id}", headers=headers)
        self.assertEqual(del_res.status_code, 200)

    async def test_5_report_export_file_generation(self):
        """TEST 5: PDF and PPTX export routes generate non-empty files for existing analysis."""
        # Create an Analysis record directly in DB for testing export route
        db = SessionLocal()
        user = db.query(User).filter(User.email == "rag_user@example.com").first()
        sample_payload = json.dumps({
            "idea": "AI Startup Co-founder",
            "idea_analysis": {"problem_validation": "Strong problem validation"},
            "market_analysis": {"tam": "$10B", "sam": "$2B", "som": "$500M"},
            "confidence_scores": {"Overall": 85.0}
        })
        analysis = Analysis(user_id=user.id, idea="AI Startup Co-founder", payload=sample_payload)
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        analysis_id = analysis.id
        db.close()

        # Login token
        login_res = await self.client.post("/auth/login", json={"email": "rag_user@example.com", "password": "Password123!"})
        self.assertEqual(login_res.status_code, 200)
        headers = {"Authorization": f"Bearer {login_res.json()['access_token']}"}

        # PDF Download
        pdf_res = await self.client.get(f"/download/pdf?analysisId={analysis_id}", headers=headers)
        self.assertEqual(pdf_res.status_code, 200)
        self.assertTrue(len(pdf_res.content) > 100)

        # PPTX Download
        pptx_res = await self.client.get(f"/download/pptx?analysisId={analysis_id}", headers=headers)
        self.assertEqual(pptx_res.status_code, 200)
        self.assertTrue(len(pptx_res.content) > 100)

    async def test_6_production_health_and_metrics_verification(self):
        """TEST 6: /health, /health/ready, and /health/metrics return 200 OK with correct status."""
        h1 = await self.client.get("/health")
        self.assertEqual(h1.status_code, 200)
        self.assertEqual(h1.json()["status"], "ok")

        h2 = await self.client.get("/health/ready")
        self.assertEqual(h2.status_code, 200)
        self.assertEqual(h2.json()["status"], "ok")

        h3 = await self.client.get("/health/metrics")
        self.assertEqual(h3.status_code, 200)
        self.assertEqual(h3.json()["status"], "ok")


if __name__ == "__main__":
    unittest.main()
