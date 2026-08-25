from fastapi import APIRouter, Depends
from deps import get_current_user
from services.agent_optimization_service import agent_optimization_service
from services.regression_eval_service import regression_eval_service

router = APIRouter(prefix="/optimization", tags=["optimization"])

@router.get("/agent-scorecard")
async def get_agent_scorecard(current_user=Depends(get_current_user)):
    return agent_optimization_service.evaluate_agents()

@router.get("/regression-test")
async def run_regression_test(current_user=Depends(get_current_user)):
    return regression_eval_service.run_regression_suite()

@router.get("/founder-value")
async def get_founder_value(current_user=Depends(get_current_user)):
    return regression_eval_service.calculate_founder_value_score()
