from typing import Optional, Dict, Any


class IdeaExecutorError(Exception):
    """Base exception class for IdeaExecutor platform errors."""
    def __init__(
        self,
        message: str = "An internal system error occurred.",
        error_code: str = "INTERNAL_SERVER_ERROR",
        retryable: bool = True,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.retryable = retryable
        self.details = details or {}


class LLMServiceError(IdeaExecutorError):
    def __init__(self, message: str = "AI service request failed.", retryable: bool = True):
        super().__init__(message=message, error_code="LLM_SERVICE_ERROR", retryable=retryable)


class LLMRateLimitError(IdeaExecutorError):
    def __init__(self, message: str = "AI service rate limit reached. Please retry shortly."):
        super().__init__(message=message, error_code="LLM_RATE_LIMITED", retryable=True)


class LLMAuthenticationError(IdeaExecutorError):
    def __init__(self, message: str = "AI service authentication failed. Invalid API key."):
        super().__init__(message=message, error_code="LLM_AUTHENTICATION_FAILED", retryable=False)


class LLMTimeoutError(IdeaExecutorError):
    def __init__(self, message: str = "AI service request timed out."):
        super().__init__(message=message, error_code="LLM_TIMEOUT", retryable=True)


class LLMResponseParseError(IdeaExecutorError):
    def __init__(self, message: str = "AI service returned unparseable structured response."):
        super().__init__(message=message, error_code="LLM_INVALID_RESPONSE", retryable=True)


class RAGServiceError(IdeaExecutorError):
    def __init__(self, message: str = "Document vector store search failed."):
        super().__init__(message=message, error_code="RAG_SERVICE_ERROR", retryable=True)


class DatabaseServiceError(IdeaExecutorError):
    def __init__(self, message: str = "Database transaction failed."):
        super().__init__(message=message, error_code="DATABASE_ERROR", retryable=True)


class ValidationServiceError(IdeaExecutorError):
    def __init__(self, message: str = "Request data validation failed."):
        super().__init__(message=message, error_code="VALIDATION_ERROR", retryable=False)


class ExternalServiceError(IdeaExecutorError):
    def __init__(self, message: str = "External integration service error."):
        super().__init__(message=message, error_code="EXTERNAL_SERVICE_ERROR", retryable=True)
