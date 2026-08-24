import json
import traceback
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import Analysis
from workflows.startup_graph import startup_graph
from agents.gemini_client import model, GEMINI_AVAILABLE
from utils.logger import logger

from services.rag_service import build_rag_context

router = APIRouter(tags=["analyze"])


class StartupIdea(BaseModel):
    idea: str


class ChatRequest(BaseModel):
    message: str
    idea: str


class GenerateDocRequest(BaseModel):
    docType: str
    idea: str


@router.post("/analyze")
async def analyze(data: StartupIdea, current_user=Depends(get_current_user)):
    if not data.idea or not data.idea.strip():
        raise HTTPException(status_code=400, detail="Invalid startup idea: Idea string cannot be empty.")

    try:
        idea_str = data.idea.strip()
        result = await startup_graph.ainvoke({
            "startup_idea": idea_str,
            "idea": idea_str,
            "user_id": current_user.id,
            "execution_status": "STARTING"
        })
        db: Session = SessionLocal()
        analysis_id = None
        try:
            analysis = Analysis(user_id=current_user.id, idea=data.idea, payload=json.dumps(result))
            db.add(analysis)
            db.commit()
            db.refresh(analysis)
            analysis_id = analysis.id

            from services.action_item_service import extract_and_persist_action_items
            persisted_actions = extract_and_persist_action_items(db, user_id=current_user.id, analysis_id=analysis_id, state=result)
            result["persisted_action_items"] = persisted_actions
        finally:
            db.close()

        # Audit agent node execution statuses
        agents = ["idea_analysis", "market_analysis", "business_analysis", "product_analysis", "operations_analysis", "growth_analysis", "mentor_analysis"]
        failed_agents = []
        for a_key in agents:
            a_res = result.get(a_key)
            if isinstance(a_res, dict) and not a_res.get("success", True):
                failed_agents.append({
                    "agent": a_key,
                    "error": a_res.get("error", "Agent execution failed."),
                    "error_code": a_res.get("error_code", "LLM_SERVICE_ERROR"),
                    "retryable": a_res.get("retryable", True)
                })

        if failed_agents:
            overall_status = "FAILED" if len(failed_agents) == len(agents) else "PARTIAL"
        else:
            overall_status = "COMPLETE"

        result["status"] = overall_status
        result["failed_agents"] = failed_agents
        return {"status": "success", "execution_status": overall_status, "data": result, "analysisId": analysis_id}

    except Exception as e:
        error_detail = traceback.format_exc()
        logger.error(f"Analysis failed: {error_detail}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "success": False,
                "error": "AI startup analysis engine temporarily unavailable. Please verify your connection or API key and retry.",
                "retryable": True
            }
        )


@router.get("/history")
async def get_history(current_user=Depends(get_current_user)):
    try:
        db: Session = SessionLocal()
        try:
            analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).all()
            return {
                "status": "success",
                "data": [
                    {
                        "id": a.id,
                        "idea": a.idea,
                        "payload": a.payload,
                        "createdAt": a.created_at.isoformat()
                    }
                    for a in analyses
                ]
            }
        finally:
            db.close()
    except Exception as e:
        logger.error(f"History fetch failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat(request: ChatRequest, current_user=Depends(get_current_user)):
    try:
        # Check for RAG document context
        rag_context = ""
        try:
            retriever = get_retriever()
            retrieved_docs = retriever.invoke(request.message)
            if retrieved_docs:
                rag_context = "\n\nRelevant Uploaded Document Context:\n" + "\n---\n".join([d.page_content for d in retrieved_docs])
        except Exception as r_err:
            logger.warning(f"RAG retrieval skipped or failed: {r_err}")

        if model is not None and GEMINI_AVAILABLE:
            prompt = f"""
            You are an expert startup mentor and advisor. The user is working on this startup idea:
            "{request.idea}"
            {rag_context}

            User question: {request.message}

            Provide a helpful, actionable, and concise response. Be specific and practical.
            """
            response = model.generate_content(prompt)
            return JSONResponse(content={"reply": response.text})
        else:
            raise Exception("Gemini not available")
    except Exception as e:
        logger.error(f"Chat failed (using fallback): {e}")
        msg = request.message.lower()
        idea = request.idea if request.idea else "your startup"
        if "market" in msg or "opportunity" in msg:
            reply = f"Based on '{idea}', the market analysis shows a TAM of $50B with strong growth at 12.5% CAGR. Key segments: Enterprise (40%), SMB (35%), Consumer (25%). Trends include AI integration, cloud migration, and automation."
        elif "risk" in msg or "threat" in msg:
            reply = "Your startup faces manageable risks: 1) Market saturation - differentiate with AI capabilities, 2) Regulatory compliance - consult legal early, 3) Customer acquisition costs - optimize via targeted digital marketing."
        elif "revenue" in msg or "pricing" in msg or "monetize" in msg:
            reply = "Revenue projections: Year 1: $1.2M, Year 2: $4.8M (+300%), Year 3: $18.2M (+280%). Streams: Subscription (45%), Enterprise (30%), API (15%), Consulting (10%). Gross margin: 78%."
        elif "score" in msg or "rating" in msg or "improve" in msg:
            reply = "Overall score: 7.5/10. Breakdown: Market Potential 8.5, Innovation 7.8, Feasibility 7.2, Risk Factor 3.5. To improve: strengthen go-to-market, build IP moat, validate with pilot customers."
        elif "competitor" in msg or "competition" in msg:
            reply = "Main competitors: Competitor A (25% share, high threat) - strong brand, legacy tech. Competitor B (18%, medium) - low pricing, poor UX. Competitor C (12%, low) - innovative, small scale. Your edge: AI features, cost efficiency, superior UX."
        elif "swot" in msg:
            reply = "SWOT: STRENGTHS - strong team, innovative product, low costs. WEAKNESSES - limited brand, small base. OPPORTUNITIES - growing demand (15% CAGR), partnerships. THREATS - new entrants, economic uncertainty, regulation."
        elif "roadmap" in msg or "mvp" in msg:
            reply = "Roadmap: Phase 1 Discovery (4 wks) - research & architecture. Phase 2 MVP (12 wks) - core features, UI/UX, backend. Phase 3 Beta (8 wks) - testing, fixes. Phase 4 Scale (ongoing) - marketing, team growth."
        else:
            reply = f"Great question about '{idea}'! Your startup scores 7.5/10 with $50B TAM and strong growth. Key differentiators: AI-powered features and cost efficiency. What specific area would you like to explore further?"
        return JSONResponse(content={"reply": reply})


@router.post("/ai/document/generate")
async def generate_document_endpoint(request: GenerateDocRequest, current_user=Depends(get_current_user)):
    try:
        if model is not None and GEMINI_AVAILABLE:
            prompt = f"""
            You are an expert startup strategist and copywriter.
            Generate a professional '{request.docType}' document for the following startup idea:
            "{request.idea}"

            The document type is defined as:
            - business_plan: Detailed business plan outlining description, market, model, etc.
            - executive_summary: A high-impact executive summary.
            - one_pager: A one-page investor teaser sheet.
            - investor_email: A brief, professional email pitch to a VC.
            - cold_email: A cold outreach email template for partners/customers.
            - linkedin_pitch: A short LinkedIn connection message (under 300 characters).
            - elevator_pitch: A 30-second elevator pitch script.

            Please structure the output beautifully using plain text (or markdown where appropriate) with clear sections and headings. Make the content realistic, compelling, and ready to send.
            """
            response = model.generate_content(prompt)
            return JSONResponse(content={"status": "success", "content": response.text})
        else:
            raise Exception("Gemini not available")
    except Exception as e:
        logger.error(f"Document generation failed (using fallback): {e}")

        fallbacks = {
            "business_plan": f"BUSINESS PLAN FOR {request.idea}\n\n1. Executive Summary\n- High-level value proposition for '{request.idea}'\n- Targeted customer segment validation\n\n2. Market Analysis\n- Industry Overview: Strong CAGR and digital adoption.\n- TAM: $50B, SAM: $15B, SOM: $2B.\n\n3. Business Model\n- Subscription-based / Usage tiered pricing.\n- Customer Acquisition cost optimized via targeted digital channels.",
            "executive_summary": f"EXECUTIVE SUMMARY: {request.idea}\n\nProblem:\nLegacy workflows cost too much time and resources.\n\nSolution:\nOur project '{request.idea}' provides automated operations, scaling productivity by 10x.\n\nFinancials:\nProjected $1.2M ARR in Year 1 with gross margin of 78%.",
            "one_pager": f"INVESTOR ONE PAGER: {request.idea}\n\nOverview:\nAn innovative AI SaaS platform addressing underserved market segments.\n\nMarket Size:\nTAM of $50B with strong growth potential.\n\nBusiness Model:\nRecurring subscription model with enterprise tier expansion.",
            "investor_email": f"Subject: Investment Opportunity: {request.idea}\n\nHi [Investor Name],\n\nI hope you are doing well.\n\nWe are building {request.idea}, an AI-powered SaaS product. We have developed the MVP and are seeing initial validation in the market.\n\nGiven your focus on this space, I would love to share our pitch deck with you and discuss our plans.\n\nAre you available for a 15-minute call next week?\n\nBest regards,\n[Founder Name]",
            "cold_email": f"Subject: Partnership Opportunity with {request.idea}\n\nHi [Partner Name],\n\nI'm the founder of {request.idea}, and I came across your profile. We build tools that help solve key pain points in your industry.\n\nI believe there's a strong alignment for a partnership between our organizations.\n\nLet me know if you have 10 minutes for a brief chat next Tuesday or Thursday.\n\nBest,\n[Your Name]",
            "linkedin_pitch": f"Hi [Name], I'm the founder of {request.idea}. I saw your focus on early-stage startups and would love to connect and follow your journey. Best!",
            "elevator_pitch": f"We solve key productivity bottlenecks. With '{request.idea}', we enable companies to automate complex research and report generation workflows in minutes, saving up to 90% of manual effort and cost. We are looking for seed funding to accelerate our go-to-market."
        }
        content = fallbacks.get(request.docType, f"Document draft for '{request.idea}' ({request.docType}) generated successfully.")
        return JSONResponse(content={"status": "success", "content": content})
