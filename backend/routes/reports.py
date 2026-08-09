import os
import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import Analysis
from reports.pdf_generator import generate_pdf
from pitchdeck.pptx_generator import generate_pptx
from utils.logger import logger

router = APIRouter(tags=["reports"])


@router.get("/download/pdf")
async def download_pdf(analysisId: int, current_user=Depends(get_current_user)):
    try:
        db: Session = SessionLocal()
        try:
            analysis = db.query(Analysis).filter(Analysis.id == analysisId, Analysis.user_id == current_user.id).first()
            if not analysis:
                raise HTTPException(status_code=404, detail="Analysis not found")
            result = json.loads(analysis.payload)
        finally:
            db.close()

        result["idea"] = analysis.idea

        os.makedirs("output", exist_ok=True)
        path = f"output/report_{analysisId % 100000}.pdf"

        generate_pdf(result, path)
        return FileResponse(path, media_type="application/pdf", filename="startup_report.pdf")
    except Exception as e:
        logger.error(f"PDF generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download/pptx")
async def download_pptx(analysisId: int, current_user=Depends(get_current_user)):
    try:
        db: Session = SessionLocal()
        try:
            analysis = db.query(Analysis).filter(Analysis.id == analysisId, Analysis.user_id == current_user.id).first()
            if not analysis:
                raise HTTPException(status_code=404, detail="Analysis not found")
            result = json.loads(analysis.payload)
        finally:
            db.close()

        result["idea"] = analysis.idea

        os.makedirs("output", exist_ok=True)
        path = f"output/pitch_{analysisId % 100000}.pptx"

        generate_pptx(result, path)
        return FileResponse(
            path,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename="pitch_deck.pptx"
        )
    except Exception as e:
        logger.error(f"PPTX generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
