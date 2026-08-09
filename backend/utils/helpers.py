import json

def safe_json_parse(text: str, default=None) -> dict:
    if default is None:
        default = {}
    try:
        cleaned = text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())
    except (json.JSONDecodeError, AttributeError):
        return default
