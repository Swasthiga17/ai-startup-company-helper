import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.logger import logger

GEMINI_AVAILABLE = False
model = None

try:
    import google.generativeai as genai
    from config import GEMINI_API_KEY

    if GEMINI_API_KEY and len(GEMINI_API_KEY) > 10:
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Try preferred model candidates in order
        model_candidates = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro"]
        for candidate in model_candidates:
            try:
                test_model = genai.GenerativeModel(candidate)
                # Quick verification call
                res = test_model.generate_content("Ping")
                if res and res.text:
                    model = test_model
                    GEMINI_AVAILABLE = True
                    logger.info(f"Gemini AI client successfully initialized with model: {candidate}")
                    break
            except Exception as candidate_err:
                logger.debug(f"Model candidate '{candidate}' failed verification: {candidate_err}")
                continue

    if not GEMINI_AVAILABLE:
        logger.warning("Gemini AI API key not provided or unauthenticated. Dynamic domain engine active.")
except Exception as e:
    logger.warning(f"Gemini AI package initialization bypassed: {e}")
    GEMINI_AVAILABLE = False
    model = None
