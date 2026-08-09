import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.logger import logger

GEMINI_AVAILABLE = False
model = None

try:
    from config import GEMINI_API_KEY

    if GEMINI_API_KEY and len(GEMINI_API_KEY) > 10:
        # Try modern google-genai SDK first
        try:
            from google import genai
            client = genai.Client(api_key=GEMINI_API_KEY)
            model_candidates = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
            for candidate in model_candidates:
                try:
                    res = client.models.generate_content(model=candidate, contents="Ping")
                    if res and res.text:
                        model = client
                        GEMINI_AVAILABLE = True
                        logger.info(f"Gemini AI client successfully initialized with modern google-genai SDK (model: {candidate})")
                        break
                except Exception as candidate_err:
                    logger.debug(f"Modern google-genai candidate '{candidate}' failed verification: {candidate_err}")
                    continue
        except Exception as new_sdk_err:
            logger.debug(f"Modern google-genai SDK init bypassed: {new_sdk_err}")

        # Fallback to legacy google.generativeai SDK if modern SDK is unavailable
        if not GEMINI_AVAILABLE:
            try:
                import google.generativeai as genai_legacy
                genai_legacy.configure(api_key=GEMINI_API_KEY)
                model_candidates = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-1.5-pro", "gemini-pro"]
                for candidate in model_candidates:
                    try:
                        test_model = genai_legacy.GenerativeModel(candidate)
                        res = test_model.generate_content("Ping")
                        if res and res.text:
                            model = test_model
                            GEMINI_AVAILABLE = True
                            logger.info(f"Gemini AI client initialized with legacy google.generativeai SDK (model: {candidate})")
                            break
                    except Exception as candidate_err:
                        logger.debug(f"Legacy model candidate '{candidate}' failed verification: {candidate_err}")
                        continue
            except Exception as legacy_err:
                logger.debug(f"Legacy google.generativeai SDK init bypassed: {legacy_err}")

    if not GEMINI_AVAILABLE:
        logger.warning("Gemini AI API key not provided or unauthenticated. Dynamic domain engine active.")
except Exception as e:
    logger.warning(f"Gemini AI package initialization bypassed: {e}")
    GEMINI_AVAILABLE = False
    model = None
