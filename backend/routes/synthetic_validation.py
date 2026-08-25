from fastapi import APIRouter, Depends
from deps import get_current_user
from services.synthetic_validation_service import synthetic_validation_service

router = APIRouter(prefix="/synthetic", tags=["synthetic"])

@router.get("/report")
async def get_synthetic_report(current_user=Depends(get_current_user)):
    return synthetic_validation_service.get_synthetic_validation_report()

@router.post("/run-adversarial")
async def run_adversarial_tests(current_user=Depends(get_current_user)):
    return synthetic_validation_service.run_adversarial_tests()

@router.get("/personas")
async def get_synthetic_personas(current_user=Depends(get_current_user)):
    return {
        "synthetic_startup_personas": synthetic_validation_service.SYNTHETIC_PERSONAS,
        "simulated_founder_personas": synthetic_validation_service.SIMULATED_FOUNDER_PERSONAS
    }
