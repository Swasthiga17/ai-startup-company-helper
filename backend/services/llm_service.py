import os
import json
import time
import re
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
        self.fallback_models = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-3.1-pro-preview"]
        self._initialize()

    def _initialize(self):
        if not self.api_key or len(self.api_key) < 10:
            logger.warning("GEMINI_API_KEY environment variable not configured or invalid.")
            self.available = False
            return

        try:
            from google import genai
            client = genai.Client(api_key=self.api_key)
            model_candidates = [self.model_name] + [m for m in self.fallback_models if m != self.model_name]
            model_candidates = list(dict.fromkeys(model_candidates))
            for candidate in model_candidates:
                try:
                    res = client.models.generate_content(model=candidate, contents="Ping")
                    if res and res.text:
                        self.client = client
                        self.model_name = candidate
                        self.available = True
                        self.sdk_type = "modern"
                        logger.info(f"LLMService successfully initialized with google-genai SDK (model: {candidate})")
                        return
                except Exception as candidate_err:
                    logger.debug(f"google-genai model candidate '{candidate}' failed init: {candidate_err}")
                    continue
        except Exception as e:
            logger.error(f"Failed to initialize google-genai SDK: {e}")

        self.available = False
        self.client = None
        self.sdk_type = None

    def generate_text(self, prompt: str, temperature: float = 0.7, retries: int = 2, raise_exceptions: bool = False, response_mime_type: Optional[str] = None) -> Optional[str]:
        if not self.available or self.client is None:
            logger.warning("LLMService called but Gemini SDK is unconfigured.")
            if raise_exceptions:
                raise LLMAuthenticationError("Gemini API key is unconfigured or invalid.")
            return None

        start_time = time.time()
        models_to_try = [self.model_name] + [m for m in self.fallback_models if m != self.model_name]
        models_to_try = list(dict.fromkeys(models_to_try))

        last_error = None
        total_retries = 0
        for model_candidate in models_to_try:
            attempt = 0
            backoff = 0.5
            while attempt < retries:
                try:
                    text_result = None
                    config = {"temperature": temperature}
                    if response_mime_type:
                        config["response_mime_type"] = response_mime_type

                    response = self.client.models.generate_content(
                        model=model_candidate,
                        contents=prompt,
                        config=config
                    )
                    if response and response.text:
                        text_result = response.text.strip()

                    if text_result:
                        self.model_name = model_candidate
                        return text_result
                    else:
                        logger.warning(f"Empty LLM response received from {model_candidate} on attempt {attempt + 1}")
                except Exception as e:
                    total_retries += 1
                    err_str = str(e).lower()
                    last_error = e
                    logger.warning(f"LLM generate_text attempt {attempt + 1} with model {model_candidate} failed ({type(e).__name__}): {e}")
                    if "401" in err_str or "403" in err_str or "invalid api key" in err_str or "api_key_invalid" in err_str:
                        logger.error("Gemini Authentication Error: Invalid API key provided.")
                        if raise_exceptions:
                            raise LLMAuthenticationError()
                        return None
                    elif "429" in err_str or "quota" in err_str or "resource_exhausted" in err_str:
                        logger.warning(f"Rate limit hit on {model_candidate}, switching to next model candidate...")
                        break
                    elif "timeout" in err_str or "deadline" in err_str:
                        time.sleep(backoff)
                        backoff *= 1.5
                    else:
                        time.sleep(backoff)
                        backoff *= 1.5
                attempt += 1

        if raise_exceptions:
            if last_error and ("429" in str(last_error) or "quota" in str(last_error).lower()):
                raise LLMRateLimitError()
            raise LLMServiceError(f"All candidate LLM models failed to respond. Last error: {last_error}")

        return None

    def generate_json(self, prompt: str, schema_cls: Optional[Type[T]] = None, temperature: float = 0.2, retries: int = 2, raise_exceptions: bool = False) -> Optional[Dict[str, Any]]:
        """
        Generates structured JSON output from prompt, validating against a Pydantic schema if provided.
        """
        json_prompt = f"{prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. Do not include markdown code fences, explanation text, or preambles."

        raw_text = self.generate_text(
            json_prompt,
            temperature=temperature,
            retries=retries,
            raise_exceptions=raise_exceptions,
            response_mime_type="application/json"
        )
        if not raw_text:
            logger.warning("Empty raw_text received from generate_text in generate_json")
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
            logger.warning(f"JSON parsing/validation failed on first attempt ({type(parse_err).__name__}: {parse_err}). Attempting repair...")
            repaired = self._repair_json(clean_text)
            if repaired:
                try:
                    parsed = json.loads(repaired)
                    if schema_cls:
                        validated = schema_cls.model_validate(parsed)
                        return validated.model_dump()
                    return parsed
                except Exception as repair_err:
                    logger.warning(f"Repaired JSON parsing failed: {repair_err}")
            logger.error(f"Unrecoverable JSON output: {clean_text[:200]}")
            if raise_exceptions:
                raise LLMResponseParseError(f"Failed to parse or validate structured JSON output from LLM: {parse_err}")
            return None

    def _clean_json_text(self, text: str) -> str:
        if not text:
            return ""
        text = text.strip()

        # 1. Look for ```json ... ``` or ``` ... ``` code blocks
        if "```" in text:
            parts = text.split("```")
            for i in range(1, len(parts), 2):
                block = parts[i].strip()
                if block.startswith("json"):
                    block = block[4:].strip()
                if block.startswith("{") or block.startswith("["):
                    return block

        # 2. Extract substring between first '{' / '[' and last '}' / ']'
        start_brace = text.find('{')
        start_bracket = text.find('[')

        if start_brace != -1 and (start_bracket == -1 or start_brace < start_bracket):
            end_brace = text.rfind('}')
            if end_brace > start_brace:
                return text[start_brace:end_brace + 1]
        elif start_bracket != -1:
            end_bracket = text.rfind(']')
            if end_bracket > start_bracket:
                return text[start_bracket:end_bracket + 1]

        return text.strip()

    def _repair_json(self, text: str) -> Optional[str]:
        if not text:
            return None
        start_brace = text.find('{')
        end_brace = text.rfind('}')
        if start_brace != -1 and end_brace > start_brace:
            candidate = text[start_brace:end_brace + 1]
            # Strip trailing commas before closing braces/brackets
            candidate = re.sub(r',\s*([\}\]])', r'\1', candidate)
            return candidate
        return None


# Global singleton instance
llm_service = LLMService()
