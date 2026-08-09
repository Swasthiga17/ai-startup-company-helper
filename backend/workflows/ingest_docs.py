import os
from typing import List, Dict, Any, Optional
from langchain.text_splitter import RecursiveCharacterTextSplitter
from services.rag_service import ingest_document_chunks
from utils.logger import logger

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_PATH = os.path.join(BASE_DIR, "startup_docs")


def process_and_ingest_file(file_path: str, doc_id: int, user_id: int) -> bool:
    """
    Extracts text page by page from PDF/TXT/Markdown, generates chunks with metadata,
    and stores them in ChromaDB with user_id isolation.
    """
    if not os.path.exists(file_path):
        logger.error(f"File not found for ingestion: {file_path}")
        return False

    filename = os.path.basename(file_path)
    ext = os.path.splitext(filename)[1].lower()

    pages = []
    try:
        if ext == ".pdf":
            from langchain_community.document_loaders import PyPDFLoader
            loader = PyPDFLoader(file_path)
            loaded_pages = loader.load()
            for idx, page in enumerate(loaded_pages, start=1):
                page_num = page.metadata.get("page", idx - 1) + 1 if "page" in page.metadata else idx
                pages.append({"page_number": page_num, "text": page.page_content})
        elif ext in [".txt", ".md", ".markdown"]:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            pages.append({"page_number": 1, "text": content})
        else:
            logger.warning(f"Unsupported file format for RAG ingestion: {ext}")
            return False
    except Exception as e:
        logger.error(f"Failed to extract text from {filename}: {e}")
        return False

    if not pages:
        logger.warning(f"No pages extracted from {filename}.")
        return False

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    all_chunks_data = []
    for p in pages:
        page_num = p["page_number"]
        page_text = p["text"]
        if not page_text.strip():
            continue

        raw_chunks = splitter.split_text(page_text)
        for c in raw_chunks:
            all_chunks_data.append({
                "page_number": page_num,
                "content": c
            })

    if not all_chunks_data:
        logger.warning(f"No text chunks generated for {filename}.")
        return False

    return ingest_document_chunks(doc_id=doc_id, user_id=user_id, filename=filename, chunks_data=all_chunks_data)


def run_ingestion():
    """Legacy bulk ingestion function."""
    if not os.path.exists(DOCS_PATH):
        os.makedirs(DOCS_PATH, exist_ok=True)
        return

    files = [os.path.join(DOCS_PATH, f) for f in os.listdir(DOCS_PATH) if os.path.isfile(os.path.join(DOCS_PATH, f))]
    for idx, f in enumerate(files, 1):
        process_and_ingest_file(file_path=f, doc_id=idx, user_id=1)


if __name__ == "__main__":
    run_ingestion()