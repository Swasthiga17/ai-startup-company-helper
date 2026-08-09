import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import Document
from utils.logger import logger
from workflows.ingest_docs import process_and_ingest_file
from services.rag_service import delete_document_chunks

router = APIRouter(tags=["documents"])


@router.post("/upload-document")
async def upload_document(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="Invalid filename")

        safe_filename = os.path.basename(file.filename)
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, safe_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        startup_docs_dir = "startup_docs"
        os.makedirs(startup_docs_dir, exist_ok=True)
        shutil.copy(file_path, os.path.join(startup_docs_dir, safe_filename))

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
        try:
            success = process_and_ingest_file(file_path=file_path, doc_id=doc_id, user_id=current_user.id)
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


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: int, current_user=Depends(get_current_user)):
    try:
        db: Session = SessionLocal()
        try:
            doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == current_user.id).first()
            if not doc:
                raise HTTPException(status_code=404, detail="Document not found")

            if os.path.exists(doc.storage_path):
                try:
                    os.remove(doc.storage_path)
                except Exception:
                    pass

            startup_path = os.path.join("startup_docs", doc.filename)
            if os.path.exists(startup_path):
                try:
                    os.remove(startup_path)
                except Exception:
                    pass

            # Delete vector chunks from ChromaDB
            delete_document_chunks(doc_id=doc_id, user_id=current_user.id)

            db.delete(doc)
            db.commit()

            return {"status": "success", "message": "Document deleted successfully"}
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Failed to delete document: {e}")
        raise HTTPException(status_code=500, detail=str(e))
