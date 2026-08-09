import os
import json
import time
import traceback
from typing import Optional, Dict, Any, Type, TypeVar
from pydantic import BaseModel

from config import GEMINI_API_KEY
from utils.logger import logger
from core.exceptions import (
    LLMServiceError,
    LLMRateLimitError,
    LLMAuthenticationError,
    LLMTimeoutError,
    LLMResponseParseError
)

T = TypeVar("T", bound=BaseModel)

GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


class LLMService:
    def __init__(self, model_name: str = GEMINI_MODEL):
        self.model_name = model_name
        self.api_key = os.environ.get("GEMINI_API_KEY", GEMINI_API_KEY)
        self.client = None
        self.available = False
        self.sdk_type = None  # "modern" or "legacy"
        self.fallback_models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-pro"]
        self._initialize()

    def _initialize(self):
        if not self.api_key or len(self.api_key) < 10:
            logger.warning("GEMINI_API_KEY environment variable not configured or invalid.")
            self.available = False
            return

        # 1. Try modern google-genai SDK (from google import genai)
        try:
            from google import genai
            client = genai.Client(api_key=self.api_key)
            model_candidates = [self.model_name] + [m for m in self.fallback_models if m != self.model_name]
            for candidate in model_candidates:
                try:
                    res = client.models.generate_content(model=candidate, contents="Ping")
                    if res and res.text:
                        self.client = client
                        self.model_name = candidate
                        self.available = True
                        self.sdk_type = "modern"
                        logger.info(f"LLMService successfully initialized with modern google-genai SDK (model: {candidate})")
                        return
                except Exception as candidate_err:
                    logger.debug(f"Modern google-genai model candidate '{candidate}' failed init: {candidate_err}")
                    continue
        except Exception as e:
            logger.debug(f"Modern google-genai SDK init bypassed: {e}")

        # 2. Fallback to legacy google.generativeai SDK
        try:
            import google.generativeai as genai_legacy
            genai_legacy.configure(api_key=self.api_key)

            model_candidates = [self.model_name] + [m for m in self.fallback_models if m != self.model_name]
            try:
                available_models = [m.name.replace("models/", "") for m in genai_legacy.list_models() if "generateContent" in m.supported_generation_methods]
                if available_models:
                    model_candidates = available_models + model_candidates
            except Exception as list_err:
                logger.debug(f"List models check skipped: {list_err}")

            for candidate in model_candidates:
                try:
                    test_model = genai_legacy.GenerativeModel(candidate)
                    self.client = test_model
                    self.model_name = candidate
                    self.available = True
                    self.sdk_type = "legacy"
                    logger.info(f"LLMService successfully initialized with legacy google.generativeai SDK (model: {candidate})")
                    return
                except Exception as candidate_err:
                    logger.debug(f"Legacy candidate model '{candidate}' failed init: {candidate_err}")
                    continue
        except Exception as e:
            logger.error(f"Failed to initialize Gemini SDK: {e}")
            self.available = False
            self.sdk_type = None

    def generate_text(self, prompt: str, temperature: float = 0.7, retries: int = 2, raise_exceptions: bool = False) -> Optional[str]:
        if not self.available or self.client is None:
            logger.warning("LLMService called but Gemini SDK is unconfigured.")
            if raise_exceptions:
                raise LLMAuthenticationError("Gemini API key is unconfigured or invalid.")
            return None

        start_time = time.time()
        models_to_try = [self.model_name] + [m for m in self.fallback_models if m != self.model_name]

        last_error = None
        total_retries = 0
        for model_candidate in models_to_try:
            attempt = 0
            backoff = 0.5
            while attempt < retries:
                try:
                    text_result = None
                    if self.sdk_type == "modern":
                        response = self.client.models.generate_content(
                            model=model_candidate,
                            contents=prompt,
                            config={"temperature": temperature}
                        )
                        if response and response.text:
                            text_result = response.text.strip()
                    else:
                        import google.generativeai as genai_legacy
                        client_model = genai_legacy.GenerativeModel(model_candidate)
                        generation_config = {"temperature": temperature}
                        response = client_model.generate_content(prompt, generation_config=generation_config)
                        if response and response.text:
                            text_result = response.text.strip()

                    if text_result:
                        self.model_name = model_candidate
                        duration_ms = round((time.time() - start_time) * 1000.0, 2)
                        
                        from core.observability import metrics_collector, log_structured_event
                        metrics_collector.inc_llm(success=True, retries=total_retries)
                        log_structured_event("llm_request", {
                            "model": model_candidate,
                            "duration_ms": duration_ms,
                            "retries": total_retries,
                            "success": True,
                            "sdk_type": self.sdk_type
                        })
                        return text_result
                    else:
                        logger.warning(f"Empty LLM response received from {model_candidate} on attempt {attempt + 1}")
                except Exception as e:
                    total_retries += 1
                    err_str = str(e).lower()
                    last_error = e
                    # Classify Gemini Errors securely without logging raw credentials
                    if "401" in err_str or "403" in err_str or "invalid api key" in err_str or "api_key_invalid" in err_str:
                        logger.error("Gemini Authentication Error: Invalid API key provided.")
                        if raise_exceptions:
                            raise LLMAuthenticationError()
                        return None
                    elif "429" in err_str or "quota" in err_str or "resource_exhausted" in err_str:
                        logger.warning(f"Rate limit hit on {model_candidate}, switching to next model candidate...")
                        break
                    elif "timeout" in err_str or "deadline" in err_str:
                        logger.warning(f"Timeout on model {model_candidate}, attempt {attempt + 1}")
                        time.sleep(backoff)
                        backoff *= 1.5
                    else:
                        logger.warning(f"LLM generate_text attempt {attempt + 1} with model {model_candidate} failed: {e}")
                        time.sleep(backoff)
                        backoff *= 1.5
                attempt += 1

        if raise_exceptions:
            if last_error and ("429" in str(last_error) or "quota" in str(last_error).lower()):
                raise LLMRateLimitError()
            raise LLMServiceError("All candidate LLM models failed to respond.")

        return None

    def generate_json(self, prompt: str, schema_cls: Optional[Type[T]] = None, temperature: float = 0.2, retries: int = 2, raise_exceptions: bool = False) -> Optional[Dict[str, Any]]:
        """
        Generates structured JSON output from prompt, validating against a Pydantic schema if provided.
        """
        json_prompt = f"{prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. Do not include markdown code fences, explanation text, or preambles."

        raw_text = self.generate_text(json_prompt, temperature=temperature, retries=retries, raise_exceptions=raise_exceptions)
        if not raw_text:
            if raise_exceptions:
                raise LLMResponseParseError("Empty response received from LLM service.")
            return None

        clean_text = self._clean_json_text(raw_text)
        try:
            parsed = json.loads(clean_text)
            if schema_cls:
                validated = schema_cls.model_validate(parsed)
                return validated.model_dump()
            return parsed
        except Exception as parse_err:
            logger.warning(f"JSON parsing/validation failed on first attempt: {parse_err}. Attempting repair...")
            repaired = self._repair_json(clean_text)
            if repaired:
                try:
                    parsed = json.loads(repaired)
                    if schema_cls:
                        validated = schema_cls.model_validate(parsed)
                        return validated.model_dump()
                    return parsed
                except Exception:
                    pass
            logger.error(f"Unrecoverable JSON output: {clean_text[:200]}")
            if raise_exceptions:
                raise LLMResponseParseError("Failed to parse or repair structured JSON output from LLM.")
            return None

    def _clean_json_text(self, text: str) -> str:
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    def _repair_json(self, text: str) -> Optional[str]:
        try:
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
                return text[start_idx:end_idx + 1]
        except Exception:
            pass
        return None


# Global singleton instance
llm_service = LLMService()
