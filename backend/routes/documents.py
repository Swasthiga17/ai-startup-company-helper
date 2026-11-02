import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import Document
from utils.logger import logger
from workflows.ingest_docs import process_and_ingest_file
from services.rag_service import delete_document_chunks

router = APIRouter(tags=["documents"])

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".md", ".markdown", ".docx", ".csv", ".json"}
MAX_FILE_SIZE = 15 * 1024 * 1024  # 15 MB


def sanitize_filename(filename: str) -> str:
    """Sanitizes filename against path traversal and unsafe characters."""
    if not filename:
        return ""
    # Strip null bytes
    cleaned = filename.replace("\x00", "")
    # Normalize path separators and extract basename
    cleaned = cleaned.replace("\\", "/")
    base = os.path.basename(cleaned).strip()
    # Strip any remaining leading/trailing dots or slashes
    base = base.lstrip("./\\")
    return base


@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    try:
        raw_name = file.filename or ""
        # Check path traversal markers before sanitization
        if ".." in raw_name or "\x00" in raw_name:
            raise HTTPException(status_code=400, detail="Invalid filename: Path traversal characters detected")

        safe_filename = sanitize_filename(raw_name)
        if not safe_filename or safe_filename in [".", ".."]:
            raise HTTPException(status_code=400, detail="Invalid filename: Filename cannot be empty or unsafe")

        # Validate extension
        ext = os.path.splitext(safe_filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type '{ext}'. Supported formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )

        # Read and validate content size
        content = await file.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes)")
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum allowed limit of {MAX_FILE_SIZE // (1024 * 1024)}MB"
            )

        # Validate PDF header if extension is .pdf
        if ext == ".pdf" and not content.startswith(b"%PDF"):
            raise HTTPException(status_code=400, detail="Invalid PDF content: Missing %PDF signature")

        # User-isolated upload directory with UUID-based unique storage filename
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        user_upload_dir = os.path.abspath(os.path.join(base_dir, "uploads", f"user_{current_user.id}"))
        os.makedirs(user_upload_dir, exist_ok=True)

        unique_id = uuid.uuid4().hex
        stored_filename = f"{unique_id}_{safe_filename}"
        file_path = os.path.abspath(os.path.join(user_upload_dir, stored_filename))

        # Anti-traversal containment verification
        if not file_path.startswith(user_upload_dir):
            raise HTTPException(status_code=400, detail="Unsafe file path detected")

        with open(file_path, "wb") as buffer:
            buffer.write(content)

        db: Session = SessionLocal()
        try:
            db_doc = Document(
                user_id=current_user.id,
                filename=safe_filename,
                storage_path=file_path,
                status="uploaded"
            )
            db.add(db_doc)
            db.commit()
            db.refresh(db_doc)
            doc_id = db_doc.id
        finally:
            db.close()

        # Run page-aware RAG ingestion with user isolation
        status_result = "error"
        try:
            success = process_and_ingest_file(
                file_path=file_path,
                doc_id=doc_id,
                user_id=current_user.id,
                original_filename=safe_filename
            )
            db = SessionLocal()
            try:
                d = db.query(Document).filter(Document.id == doc_id).first()
                if d:
                    d.status = "indexed" if success else "error"
                    db.commit()
            finally:
                db.close()
            status_result = "indexed" if success else "error"
        except Exception as ing_err:
            logger.error(f"Ingestion failed during upload: {ing_err}")
            status_result = "error"

        return JSONResponse(content={
            "status": "success",
            "message": f"Document '{safe_filename}' uploaded and processed.",
            "document": {"id": doc_id, "filename": safe_filename, "status": status_result}
        })
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents")
async def list_documents(current_user=Depends(get_current_user)):
    try:
        db: Session = SessionLocal()
        try:
            docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.created_at.desc()).all()
            return {
                "status": "success",
                "data": [
                    {
                        "id": d.id,
                        "filename": d.filename,
                        "status": d.status,
                        "created_at": d.created_at.isoformat()
                    }
                    for d in docs
                ]
            }
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Failed to list documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents/{doc_id}")
async def get_document(doc_id: int, current_user=Depends(get_current_user)):
    try:
        db: Session = SessionLocal()
        try:
            doc = db.query(Document).filter(Document.id == doc_id).first()
            if not doc:
                raise HTTPException(status_code=404, detail="Document not found")
            if doc.user_id != current_user.id:
                raise HTTPException(status_code=403, detail="Access denied: You do not own this document")
            return {
                "status": "success",
                "data": {
                    "id": doc.id,
                    "filename": doc.filename,
                    "status": doc.status,
                    "created_at": doc.created_at.isoformat()
                }
            }
        finally:
            db.close()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/documents/{doc_id}/download")
async def download_document(doc_id: int, current_user=Depends(get_current_user)):
    try:
        db: Session = SessionLocal()
        try:
            doc = db.query(Document).filter(Document.id == doc_id).first()
            if not doc:
                raise HTTPException(status_code=404, detail="Document not found")
            if doc.user_id != current_user.id:
                raise HTTPException(status_code=403, detail="Access denied: You do not own this document")

            storage_path = doc.storage_path
            filename = doc.filename
        finally:
            db.close()

        if not storage_path or not os.path.exists(storage_path):
            raise HTTPException(status_code=404, detail="Document file not found on disk")

        return FileResponse(
            path=storage_path,
            filename=filename,
            media_type="application/octet-stream"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to download document: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: int, current_user=Depends(get_current_user)):
    db: Session = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        if doc.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied: You do not own this document")

        storage_path = doc.storage_path

        # 1. Delete ChromaDB vector chunks strictly for this document and user
        delete_document_chunks(doc_id=doc_id, user_id=current_user.id)

        # 2. Delete database record
        db.delete(doc)
        db.commit()

        # 3. Only remove physical file if database transaction succeeded
        if storage_path and os.path.exists(storage_path):
            try:
                os.remove(storage_path)
            except Exception as file_err:
                logger.warning(f"Could not remove physical file {storage_path}: {file_err}")

        return {"status": "success", "message": "Document deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to delete document: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
