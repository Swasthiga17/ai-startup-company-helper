import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import tempfile
from services.rag_service import (
    get_chroma_db,
    ingest_document_chunks,
    delete_document_chunks,
    retrieve_context,
    build_rag_context,
    query_rag_with_metadata
)
from workflows.ingest_docs import process_and_ingest_file
from services.llm_service import llm_service


class TestPhase6RAG(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Setup test document and ingest for user_id=1 and user_id=2."""
        cls.temp_dir = tempfile.mkdtemp()
        cls.test_file_path = os.path.join(cls.temp_dir, "Test_Market_Report.txt")
        with open(cls.test_file_path, "w", encoding="utf-8") as f:
            f.write(
                "Test Market Report\n"
                "Page 1: The fictional startup market has 1000 potential customers.\n"
                "Page 2: The estimated annual revenue opportunity is $500,000."
            )

        # Ingest for User 1
        cls.user1_id = 9991
        cls.user2_id = 9992
        cls.doc_id = 5555

        process_and_ingest_file(cls.test_file_path, doc_id=cls.doc_id, user_id=cls.user1_id)

    @classmethod
    def tearDownClass(cls):
        """Cleanup test vector chunks and files."""
        delete_document_chunks(doc_id=cls.doc_id, user_id=cls.user1_id)
        if os.path.exists(cls.test_file_path):
            os.remove(cls.test_file_path)

    def test_1_rag_service_initialization(self):
        """TEST 1: RAG service initializes Chroma DB instance."""
        db = get_chroma_db()
        self.assertIsNotNone(db)

    def test_2_document_ingestion_works(self):
        """TEST 2: Document chunking and ingestion works."""
        chunks = [
            {"page_number": 1, "content": "Sample text for chunk 1"},
            {"page_number": 2, "content": "Sample text for chunk 2"}
        ]
        success = ingest_document_chunks(doc_id=7777, user_id=8888, filename="test_doc.txt", chunks_data=chunks)
        self.assertTrue(success)
        delete_document_chunks(doc_id=7777, user_id=8888)

    def test_3_pdf_page_metadata_preserved(self):
        """TEST 3: Page metadata is preserved."""
        res = retrieve_context("revenue opportunity", user_id=self.user1_id)
        if res:
            self.assertIn("page_number", res[0])
            self.assertIn("filename", res[0])

    def test_4_chunks_stored_and_retrieved(self):
        """TEST 4: Chunks are stored in ChromaDB and retrievable."""
        res = retrieve_context("1000 potential customers", user_id=self.user1_id)
        self.assertTrue(len(res) > 0)

    def test_5_retrieval_returns_structured_metadata(self):
        """TEST 5: Retrieval returns structured list with scores."""
        res = retrieve_context("revenue", user_id=self.user1_id)
        if res:
            first = res[0]
            self.assertIn("content", first)
            self.assertIn("filename", first)
            self.assertIn("page_number", first)
            self.assertIn("relevance_score", first)

    def test_6_user_isolation(self):
        """TEST 6: User A cannot retrieve User B's documents."""
        # Query document ingested under User 1 from User 2
        user2_res = retrieve_context("1000 potential customers", user_id=self.user2_id)
        # Should be empty for User 2
        self.assertEqual(len(user2_res), 0)

    def test_7_empty_retrieval_handling(self):
        """TEST 7: Empty retrieval returns valid structure with has_evidence=False."""
        res = build_rag_context("Nonexistent random topic XYZ", user_id=self.user2_id)
        self.assertFalse(res["has_evidence"])
        self.assertEqual(res["verification_status"], "AI_GENERATED")
        self.assertEqual(len(res["sources"]), 0)

    def test_8_citation_structure_validity(self):
        """TEST 8: Citation structure contains document_id, filename, page_number."""
        rag_info = build_rag_context("revenue opportunity", user_id=self.user1_id)
        if rag_info["has_evidence"]:
            self.assertEqual(rag_info["verification_status"], "RAG_SUPPORTED")
            src = rag_info["sources"][0]
            self.assertIn("filename", src)
            self.assertIn("page_number", src)

    def test_9_real_rag_fact_query(self):
        """TEST 9 (REAL RAG TEST): Ask fact present in ingested file."""
        rag_info = build_rag_context("What is the estimated annual revenue opportunity?", user_id=self.user1_id)
        self.assertTrue(rag_info["has_evidence"])
        self.assertIn("$500,000", rag_info["context_text"])

    def test_10_real_rag_out_of_bounds_query(self):
        """TEST 10 (REAL RAG TEST): Ask un-ingested topic ('population of Mars')."""
        rag_info = build_rag_context("What is the population of Mars?", user_id=self.user2_id)
        self.assertFalse(rag_info["has_evidence"])
        self.assertEqual(rag_info["verification_status"], "AI_GENERATED")


if __name__ == "__main__":
    unittest.main()
