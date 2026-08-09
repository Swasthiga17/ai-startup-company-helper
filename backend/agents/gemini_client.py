import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from utils.logger import logger

GEMINI_AVAILABLE = False
model = None


class GeminiClientWrapper:
    """Adapter class enabling model.generate_content(...) compatibility for modern google.genai Client."""
    def __init__(self, client, default_model: str):
        self.client = client
        self.default_model = default_model

    def generate_content(self, contents, generation_config=None, model=None):
        target_model = model or self.default_model
        config = {}
        if generation_config and isinstance(generation_config, dict):
            if "temperature" in generation_config:
                config["temperature"] = generation_config["temperature"]
            if "response_mime_type" in generation_config:
                config["response_mime_type"] = generation_config["response_mime_type"]

        response = self.client.models.generate_content(
            model=target_model,
            contents=contents,
            config=config if config else None
        )
        return response


try:
    from config import GEMINI_API_KEY, GEMINI_MODEL

    configured_model = os.environ.get("GEMINI_MODEL", GEMINI_MODEL)

    if GEMINI_API_KEY and len(GEMINI_API_KEY) > 10:
        try:
            from google import genai
            client = genai.Client(api_key=GEMINI_API_KEY)
            model_candidates = [configured_model, "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-lite"]
            model_candidates = list(dict.fromkeys(model_candidates))
            
            for candidate in model_candidates:
                try:
                    res = client.models.generate_content(model=candidate, contents="Ping")
                    if res and res.text:
                        model = GeminiClientWrapper(client, candidate)
                        GEMINI_AVAILABLE = True
                        logger.info(f"Gemini AI client successfully initialized with google-genai SDK (model: {candidate})")
                        break
                except Exception as candidate_err:
                    logger.debug(f"google-genai candidate '{candidate}' failed verification: {candidate_err}")
                    continue
        except Exception as new_sdk_err:
            logger.debug(f"google-genai SDK init bypassed: {new_sdk_err}")

    if not GEMINI_AVAILABLE:
        logger.warning("Gemini AI API key not provided or unauthenticated. Dynamic domain engine active.")
except Exception as e:
    logger.warning(f"Gemini AI package initialization bypassed: {e}")
    GEMINI_AVAILABLE = False
    model = None
