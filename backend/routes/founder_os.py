from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from deps import get_current_user
from services.founder_os_orchestrator import founder_os_orchestrator
from services.knowledge_graph_service import knowledge_graph_service
from services.autonomous_monitor_service import autonomous_monitor_service

router = APIRouter(prefix="/founder-os", tags=["founder-os"])

class ExecuteActionRequest(BaseModel):
    action_type: str
    action_title: str
    approved_by_founder: bool = False

@router.get("/weekly-brief")
async def get_weekly_brief(current_user=Depends(get_current_user)):
    return founder_os_orchestrator.generate_weekly_brief()

@router.get("/knowledge-graph")
async def get_knowledge_graph(current_user=Depends(get_current_user)):
    return knowledge_graph_service.build_startup_graph()

@router.get("/alerts")
async def get_autonomous_alerts(current_user=Depends(get_current_user)):
    return autonomous_monitor_service.monitor_startup_health()

@router.post("/execute-action")
async def execute_action(req: ExecuteActionRequest, current_user=Depends(get_current_user)):
    classification = founder_os_orchestrator.classify_action_risk(req.action_type)

    if classification["requires_approval"] and not req.approved_by_founder:
        return {
            "success": False,
            "status": "APPROVAL_REQUIRED",
            "action_title": req.action_title,
            "risk_classification": classification,
            "message": f"Action '{req.action_title}' is {classification['risk_level']} and requires explicit founder sign-off before execution."
        }

    return {
        "success": True,
        "status": "EXECUTED",
        "action_title": req.action_title,
        "risk_classification": classification,
        "message": f"Action '{req.action_title}' executed successfully."
    }
