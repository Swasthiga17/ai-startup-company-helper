import os
import sys
import unittest
from unittest.mock import patch, MagicMock
import tempfile
import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from database import SessionLocal, init_db
from models.auth_models import User
from routes.auth import create_access_token, hash_password
from services.rag_service import delete_document_chunks
from workflows.ingest_docs import process_and_ingest_file


class TestPhase26ChatRAGRegression(unittest.IsolatedAsyncioTestCase):

    @classmethod
    def setUpClass(cls):
        init_db()
        db = SessionLocal()
        
        # User 1
        cls.user1_email = "p0_01_user1@audit.com"
        u1 = db.query(User).filter(User.email == cls.user1_email).first()
        if not u1:
            u1 = User(name="Founder One", email=cls.user1_email, hashed_password=hash_password("SecurePass123!"))
            db.add(u1)
            db.commit()
            db.refresh(u1)
        cls.user1_id = u1.id
        
        # User 2 (for tenant isolation test)
        cls.user2_email = "p0_01_user2@audit.com"
        u2 = db.query(User).filter(User.email == cls.user2_email).first()
        if not u2:
            u2 = User(name="Founder Two", email=cls.user2_email, hashed_password=hash_password("SecurePass123!"))
            db.add(u2)
            db.commit()
            db.refresh(u2)
        cls.user2_id = u2.id
        db.close()

        cls.token1 = create_access_token(subject=str(cls.user1_id))
        cls.headers1 = {"Authorization": f"Bearer {cls.token1}"}

        cls.token2 = create_access_token(subject=str(cls.user2_id))
        cls.headers2 = {"Authorization": f"Bearer {cls.token2}"}

        # Create temporary document and ingest for User 1
        cls.temp_dir = tempfile.mkdtemp()
        cls.test_doc_path = os.path.join(cls.temp_dir, "Confidential_Pricing_Spec.txt")
        with open(cls.test_doc_path, "w", encoding="utf-8") as f:
            f.write(
                "Acme Enterprise Strategy:\n"
                "Enterprise License is priced at $45,000 annually with 99.99% uptime SLA.\n"
                "Starter tier is priced at $49 monthly per seat."
            )

        cls.doc1_id = 99101
        process_and_ingest_file(cls.test_doc_path, doc_id=cls.doc1_id, user_id=cls.user1_id)

    @classmethod
    def tearDownClass(cls):
        delete_document_chunks(doc_id=cls.doc1_id, user_id=cls.user1_id)
        if os.path.exists(cls.test_doc_path):
            os.remove(cls.test_doc_path)

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_normal_chat(self):
        """1. Normal chat succeeds without documents and does not raise undefined variable."""
        res = await self.client.post(
            "/chat",
            json={"message": "What is the best way to interview early beta customers?", "idea": "AI SaaS"},
            headers=self.headers1
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("reply", data)
        self.assertTrue(len(data["reply"]) > 10)

    async def test_2_rag_context_inclusion(self):
        """2. RAG context is correctly generated using build_rag_context with user_id and included in prompt."""
        captured_prompts = []

        def mock_generate_text(prompt: str):
            captured_prompts.append(prompt)
            return "Based on your internal documents, your Enterprise License is $45,000 annually."

        with patch("services.llm_service.llm_service.available", True), \
             patch("services.llm_service.llm_service.generate_text", side_effect=mock_generate_text):
            
            res = await self.client.post(
                "/chat",
                json={"message": "What is our enterprise license pricing?", "idea": "Acme SaaS"},
                headers=self.headers1
            )
            self.assertEqual(res.status_code, 200)
            self.assertEqual(len(captured_prompts), 1)
            prompt_sent = captured_prompts[0]
            
            # Verify RAG context block was injected into the prompt
            self.assertIn("Relevant Internal Documents:", prompt_sent)
            self.assertIn("$45,000 annually", prompt_sent)

    async def test_3_user_isolation_in_chat_rag(self):
        """3. User isolation: User 2 cannot access User 1's ingested RAG documents in chat."""
        captured_prompts = []

        def mock_generate_text(prompt: str):
            captured_prompts.append(prompt)
            return "General response without internal documents."

        with patch("services.llm_service.llm_service.available", True), \
             patch("services.llm_service.llm_service.generate_text", side_effect=mock_generate_text):
            
            res = await self.client.post(
                "/chat",
                json={"message": "What is our enterprise license pricing?", "idea": "Acme SaaS"},
                headers=self.headers2
            )
            self.assertEqual(res.status_code, 200)
            self.assertEqual(len(captured_prompts), 1)
            prompt_sent = captured_prompts[0]
            
            # User 2 must NOT have User 1's document in their prompt
            self.assertNotIn("$45,000 annually", prompt_sent)
            self.assertNotIn("Confidential_Pricing_Spec.txt", prompt_sent)

    async def test_4_rag_retrieval_failure_graceful(self):
        """4. Handle RAG retrieval failures gracefully without crashing or 500 errors."""
        with patch("routes.analyze.build_rag_context", side_effect=RuntimeError("ChromaDB vector store connection timeout")):
            res = await self.client.post(
                "/chat",
                json={"message": "How do we scale our marketing funnel?", "idea": "Acme SaaS"},
                headers=self.headers1
            )
            # Must NOT fail with 500, but succeed gracefully with 200 OK
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("reply", data)
            self.assertTrue(len(data["reply"]) > 5)

    async def test_5_intent_routing_preserved(self):
        """5. Preserve existing intent routing behavior."""
        res_comp = await self.client.post(
            "/chat",
            json={"message": "Analyze my competitors", "idea": "Shopify Analytics"},
            headers=self.headers1
        )
        self.assertEqual(res_comp.status_code, 200)
        data_comp = res_comp.json()
        self.assertEqual(data_comp.get("intent"), "COMPETITOR_RESEARCH")
        self.assertEqual(data_comp.get("target_route"), "/competitors")

        res_next = await self.client.post(
            "/chat",
            json={"message": "What should I do next?", "idea": "Shopify Analytics"},
            headers=self.headers1
        )
        self.assertEqual(res_next.status_code, 200)
        data_next = res_next.json()
        self.assertEqual(data_next.get("intent"), "PRIORITY_ACTION")
        self.assertEqual(data_next.get("target_route"), "/experiments")

    async def test_6_unauthenticated_guard(self):
        """6. Unauthenticated requests are rejected with 401."""
        res = await self.client.post(
            "/chat",
            json={"message": "Hello without token", "idea": "Shopify Analytics"}
        )
        self.assertEqual(res.status_code, 401)

    async def test_7_fallback_behavior_preserved(self):
        """7. Deterministic conversational fallback functions when LLM is unavailable."""
        with patch("services.llm_service.llm_service.available", False), \
             patch("routes.analyze.GEMINI_AVAILABLE", False):
            
            res = await self.client.post(
                "/chat",
                json={"message": "What is our market opportunity?", "idea": "SaaS Platform"},
                headers=self.headers1
            )
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn("reply", data)
            self.assertIn("TAM of $50B", data["reply"])


if __name__ == "__main__":
    unittest.main()
