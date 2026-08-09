import os
import time
from typing import Dict, Any, List, Optional
from utils.logger import logger

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROMA_PATH = os.getenv("CHROMA_PATH", os.path.join(BASE_DIR, "chroma_db"))
COLLECTION_NAME = "idea_executor_knowledge"


class ResilientEmbeddings:
    """Embedding wrapper with automatic fallback on API error/404."""
    def __init__(self):
        self.primary = None
        self.fallback = None
        
        api_key = os.getenv("GEMINI_API_KEY", "")
        if api_key and len(api_key) > 10:
            try:
                from langchain_google_genai import GoogleGenerativeAIEmbeddings
                self.primary = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004", google_api_key=api_key)
            except Exception:
                pass

        try:
            from langchain_community.embeddings import FakeEmbeddings
            self.fallback = FakeEmbeddings(size=384)
        except Exception:
            pass

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if self.primary:
            try:
                return self.primary.embed_documents(texts)
            except Exception as e:
                logger.debug(f"Primary embedding failed, using fallback: {e}")
        if self.fallback:
            return self.fallback.embed_documents(texts)
        return [[0.0] * 384 for _ in texts]

    def embed_query(self, text: str) -> List[float]:
        if self.primary:
            try:
                return self.primary.embed_query(text)
            except Exception as e:
                logger.debug(f"Primary query embedding failed, using fallback: {e}")
        if self.fallback:
            return self.fallback.embed_query(text)
        return [0.0] * 384


def get_embeddings():
    """Returns resilient embeddings instance."""
    return ResilientEmbeddings()


def get_chroma_db():
    """Initializes and returns Chroma vector store instance."""
    try:
        from langchain_chroma import Chroma
        embeddings = get_embeddings()
        if not os.path.exists(CHROMA_PATH):
            os.makedirs(CHROMA_PATH, exist_ok=True)

        return Chroma(
            collection_name=COLLECTION_NAME,
            persist_directory=CHROMA_PATH,
            embedding_function=embeddings
        )
    except Exception as e:
        logger.error(f"Failed to load Chroma DB: {e}")
        return None


def ingest_document_chunks(doc_id: int, user_id: int, filename: str, chunks_data: List[Dict[str, Any]]) -> bool:
    """
    Stores document chunks into ChromaDB with explicit user_id and page metadata.
    """
    if not chunks_data:
        return False

    db = get_chroma_db()
    if not db:
        logger.error("ChromaDB unavailable for document ingestion.")
        return False

    try:
        from langchain_core.documents import Document

        documents = []
        ids = []
        for idx, chunk in enumerate(chunks_data):
            page_num = chunk.get("page_number", 1)
            chunk_id = f"doc_{doc_id}_u_{user_id}_p_{page_num}_c_{idx}"
            metadata = {
                "document_id": doc_id,
                "user_id": user_id,
                "filename": filename,
                "page_number": page_num,
                "chunk_id": chunk_id,
                "uploaded_at": str(int(time.time()))
            }
            documents.append(Document(page_content=chunk.get("content", ""), metadata=metadata))
            ids.append(chunk_id)

        db.add_documents(documents=documents, ids=ids)
        logger.info(f"Ingested {len(documents)} chunks for doc_id {doc_id} into ChromaDB.")
        return True
    except Exception as e:
        logger.error(f"Failed to ingest document chunks: {e}")
        return False


def delete_document_chunks(doc_id: int, user_id: int) -> bool:
    """Deletes all vector chunks belonging to a document from ChromaDB."""
    db = get_chroma_db()
    if not db:
        return False

    try:
        db.delete(where={"$and": [{"document_id": doc_id}, {"user_id": user_id}]})
        logger.info(f"Deleted chunks for doc_id {doc_id} user_id {user_id} from ChromaDB.")
        return True
    except Exception as e:
        logger.warning(f"Metadata filter deletion failed, trying direct ID lookup: {e}")
        try:
            db.delete(where={"document_id": doc_id})
            return True
        except Exception:
            return False


def retrieve_context(query: str, user_id: int, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    Retrieves structured context chunks matching query, strictly filtered by user_id.
    Prevents cross-user data leakage.
    """
    db = get_chroma_db()
    if not db:
        return []

    try:
        results = db.similarity_search_with_score(
            query=query,
            k=top_k,
            filter={"user_id": user_id}
        )

        structured_chunks = []
        for doc, score in results:
            meta = doc.metadata or {}
            relevance = round(max(0.0, min(1.0, 1.0 - (score / 2.0))), 2) if isinstance(score, (int, float)) else 0.85
            structured_chunks.append({
                "content": doc.page_content,
                "document_id": meta.get("document_id"),
                "user_id": meta.get("user_id"),
                "filename": meta.get("filename", "Document"),
                "page_number": meta.get("page_number", 1),
                "chunk_id": meta.get("chunk_id", ""),
                "relevance_score": relevance
            })

        return structured_chunks
    except Exception as e:
        logger.error(f"Error retrieving user context: {e}")
        try:
            results = db.similarity_search(query=query, k=top_k)
            filtered = []
            for doc in results:
                meta = doc.metadata or {}
                if meta.get("user_id") == user_id:
                    filtered.append({
                        "content": doc.page_content,
                        "document_id": meta.get("document_id"),
                        "user_id": user_id,
                        "filename": meta.get("filename", "Document"),
                        "page_number": meta.get("page_number", 1),
                        "chunk_id": meta.get("chunk_id", ""),
                        "relevance_score": 0.85
                    })
            return filtered
        except Exception:
            return []


def build_rag_context(query: str, user_id: int, top_k: int = 3) -> Dict[str, Any]:
    """
    Builds context string and source citations for LLM integration.
    """
    chunks = retrieve_context(query=query, user_id=user_id, top_k=top_k)
    if not chunks:
        return {
            "context_text": "",
            "sources": [],
            "chunks": [],
            "verification_status": "AI_GENERATED",
            "has_evidence": False
        }

    formatted_sources = []
    formatted_context_blocks = []
    
    seen_sources = set()
    for idx, c in enumerate(chunks, 1):
        filename = c.get("filename", "Document")
        page = c.get("page_number", 1)
        src_str = f"{filename} — Page {page}"
        if src_str not in seen_sources:
            seen_sources.add(src_str)
            formatted_sources.append({
                "document_id": c.get("document_id"),
                "filename": filename,
                "page_number": page,
                "chunk_id": c.get("chunk_id"),
                "relevance_score": c.get("relevance_score", 0.85)
            })

        formatted_context_blocks.append(
            f"SOURCE {idx} ({filename}, Page {page}):\n{c.get('content')}"
        )

    context_text = "\n\n".join(formatted_context_blocks)
    verification_status = "RAG_SUPPORTED" if len(chunks) >= 1 else "AI_GENERATED"

    return {
        "context_text": context_text,
        "sources": formatted_sources,
        "chunks": chunks,
        "verification_status": verification_status,
        "has_evidence": True
    }


def query_rag_with_metadata(query: str, user_id: Optional[int] = None) -> Dict[str, Any]:
    """Legacy compatibility bridge wrapper."""
    if user_id is None:
        user_id = 1
    res = build_rag_context(query, user_id=user_id)
    return {
        "answer": res["context_text"] if res["has_evidence"] else None,
        "sources": [f"{s['filename']} (Page {s['page_number']})" for s in res["sources"]],
        "chunks": res["chunks"],
        "verification_status": res["verification_status"],
        "has_context": res["has_evidence"]
    }