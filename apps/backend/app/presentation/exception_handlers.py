from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse

from app.domain.exceptions import (
    DomainError,
    FileStorageError,
    InactiveUserError,
    InvalidCredentialsError,
    UserAlreadyExistsError,
    UploadedFileAlreadyExistsError,
    UploadedFileNotFoundError,
    ValidationError,
)

EXCEPTION_STATUS_MAP = {
    ValidationError: status.HTTP_400_BAD_REQUEST,
    InvalidCredentialsError: status.HTTP_401_UNAUTHORIZED,
    InactiveUserError: status.HTTP_401_UNAUTHORIZED,
    UserAlreadyExistsError: status.HTTP_409_CONFLICT,
    UploadedFileAlreadyExistsError: status.HTTP_409_CONFLICT,
    FileStorageError: status.HTTP_503_SERVICE_UNAVAILABLE,
    UploadedFileNotFoundError: status.HTTP_404_NOT_FOUND,
}


def add_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainError)
    async def handle_domain_error(
        _request: Request,
        exc: DomainError,
    ) -> JSONResponse:
        status_code = _resolve_status_code(exc)
        issues = exc.issues if isinstance(exc, ValidationError) else None

        return JSONResponse(
            status_code=status_code,
            content={
                "detail": (
                    [
                        {"field": issue.field, "message": issue.message}
                        for issue in issues
                    ]
                    if issues
                    else str(exc)
                )
            },
        )


def _resolve_status_code(exc: DomainError) -> int:
    exception_status_items = EXCEPTION_STATUS_MAP.items()
    for exception_type, mapped_status in exception_status_items:
        if isinstance(exc, exception_type):
            return mapped_status
    return status.HTTP_400_BAD_REQUEST
