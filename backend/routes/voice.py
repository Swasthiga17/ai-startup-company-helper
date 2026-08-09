import os
import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(tags=["voice"])

GRADIUM_API_KEY = os.getenv("GRADIUM_API_KEY", "gsk_438be3d7bc91e827bb5d8f8510a4be55589e0314d0bc2db897f708ae2c59778b")
GRADIUM_VOICE_ID = os.getenv("GRADIUM_VOICE_ID", "pBCgF-N7AtOx8BSM")

PAGE_SCRIPTS = {
    "dashboard": "Welcome to Startup Genie! Turn your ideas into enterprise. Here you can generate ideas and track your startup roadmap.",
    "analysis": "This is the AI-Powered Startup Analysis section. Get market insights, competitor analysis, and pitch deck generation.",
    "pricing": "Explore our pricing tiers and select the plan that best matches your startup goals.",
    "market": "Welcome to Market Research! Analyzing market size, target audience demographics, and industry growth vectors.",
    "swot": "SWOT Analysis breakdown: Strengths, Weaknesses, Opportunities, and Threats mapped for your startup.",
    "pitch-deck": "Investor Pitch Deck section: Review generated slides for venture capital presentations."
}

class VoiceRequest(BaseModel):
    page: Optional[str] = "dashboard"
    text: Optional[str] = None
    voice_id: Optional[str] = None

@router.post("/get-voice-guidance")
async def get_voice_guidance(req: VoiceRequest):
    page_name = req.page or "dashboard"
    script_text = req.text or PAGE_SCRIPTS.get(page_name, f"Welcome to Startup Genie {page_name} section!")
    voice_id = req.voice_id or GRADIUM_VOICE_ID

    static_audio_dir = os.path.join("static", "audio")
    os.makedirs(static_audio_dir, exist_ok=True)
    
    file_path = os.path.join(static_audio_dir, f"{page_name}.wav")

    # Check if audio is already generated and cached locally
    if not os.path.exists(file_path) or req.text:
        url = "https://api.gradium.ai/api/post/speech/tts"
        headers = {
            "x-api-key": GRADIUM_API_KEY,
            "Content-Type": "application/json"
        }
        payload = {
            "text": script_text,
            "voice_id": voice_id,
            "output_format": "wav",
            "only_audio": True
        }

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            if response.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(response.content)
            else:
                raise HTTPException(status_code=500, detail=f"Gradium API error: {response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {"audio_url": f"/static/audio/{page_name}.wav"}
