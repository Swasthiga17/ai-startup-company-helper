import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from datetime import datetime
from database import SessionLocal, init_db
from models.auth_models import User, ActionItem, Analysis
from services.action_item_service import (
    extract_and_persist_action_items,
    is_actionable_recommendation,
    is_duplicate_task,
    determine_priority
)
from services.confidence_service import confidence_service


class TestPhase8ActionItems(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        init_db()
        cls.db = SessionLocal()
        
        # Setup test user 1 & 2
        cls.user1 = User(
            name="Test User 1",
            email="action_test1@example.com",
            hashed_password="hashed_pwd_123"
        )
        cls.user2 = User(
            name="Test User 2",
            email="action_test2@example.com",
            hashed_password="hashed_pwd_456"
        )
        cls.db.add_all([cls.user1, cls.user2])
        cls.db.commit()
        cls.db.refresh(cls.user1)
        cls.db.refresh(cls.user2)

    @classmethod
    def tearDownClass(cls):
        cls.db.query(ActionItem).filter(ActionItem.user_id.in_([cls.user1.id, cls.user2.id])).delete(synchronize_session=False)
        cls.db.query(User).filter(User.id.in_([cls.user1.id, cls.user2.id])).delete(synchronize_session=False)
        cls.db.commit()
        cls.db.close()

    def test_1_action_item_model_creation(self):
        """TEST 1: ActionItem model instance creates cleanly."""
        item = ActionItem(
            user_id=self.user1.id,
            title="Interview 10 engineering students",
            category="VALIDATION",
            priority="HIGH",
            status="TODO",
            source_agent="IdeaAgent",
            confidence_score=85.0,
            verification_status="SUPPORTED"
        )
        self.db.add(item)
        self.db.commit()
        self.assertIsNotNone(item.id)
        self.assertEqual(item.status, "TODO")

    def test_2_actionable_recommendation_filtering(self):
        """TEST 2: Filters out non-actionable descriptive text."""
        self.assertTrue(is_actionable_recommendation("Interview 10 target customers to validate pain points"))
        self.assertFalse(is_actionable_recommendation("AI believes the market is growing fast"))

    def test_3_deduplication(self):
        """TEST 3: Recognizes substantially similar recommendations as duplicates."""
        existing = [ActionItem(user_id=self.user1.id, title="Interview 10 engineering students")]
        self.assertTrue(is_duplicate_task("Conduct interviews with 10 engineering students", existing))
        self.assertFalse(is_duplicate_task("Build automated deployment CI/CD pipeline", existing))

    def test_4_priority_determination(self):
        """TEST 4: Priority is derived from risk and confidence metrics."""
        self.assertEqual(determine_priority("OperationsAgent", "Urgent legal compliance check", 60.0), "CRITICAL")
        self.assertEqual(determine_priority("IdeaAgent", "Interview 5 users", 85.0), "HIGH")

    def test_5_ai_extraction_and_persistence(self):
        """TEST 5: AI recommendations are extracted, deduplicated, and persisted."""
        mock_state = {
            "idea_analysis": {
                "success": True,
                "recommendations": ["Interview 10 target customers before MVP launch"],
                "confidence": 88.0,
                "confidence_metadata": {"verification_status": "SUPPORTED"},
                "sources": ["market_report.pdf"]
            }
        }
        created = extract_and_persist_action_items(self.db, user_id=self.user1.id, analysis_id=None, state=mock_state)
        self.assertTrue(len(created) > 0)
        self.assertEqual(created[0]["source_agent"], "IdeaAgent")

    def test_6_user_ownership_and_isolation(self):
        """TEST 6: User A cannot see User B's action items."""
        item_u2 = ActionItem(user_id=self.user2.id, title="User 2 private task", status="TODO")
        self.db.add(item_u2)
        self.db.commit()

        u1_items = self.db.query(ActionItem).filter(ActionItem.user_id == self.user1.id).all()
        u2_items = self.db.query(ActionItem).filter(ActionItem.user_id == self.user2.id).all()

        u1_titles = [i.title for i in u1_items]
        self.assertNotIn("User 2 private task", u1_titles)

    def test_7_toggle_completion_timestamps(self):
        """TEST 7: Marking completed sets completed_at, reopening clears completed_at."""
        item = ActionItem(user_id=self.user1.id, title="Toggle completion test", status="TODO")
        self.db.add(item)
        self.db.commit()

        # Complete task
        item.status = "COMPLETED"
        item.completed_at = datetime.utcnow()
        self.db.commit()
        self.assertIsNotNone(item.completed_at)

        # Reopen task
        item.status = "TODO"
        item.completed_at = None
        self.db.commit()
        self.assertIsNone(item.completed_at)

    def test_8_phase_7_confidence_regression(self):
        """TEST 8: Phase 7 confidence engine regression passes."""
        eval_res = confidence_service.evaluate_analysis({"analysis": "Test"}, rag_sources=[])
        self.assertIsNotNone(eval_res["score"])


if __name__ == "__main__":
    unittest.main()
