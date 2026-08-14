"""DRF exception handling shared across API modules."""

from rest_framework import exceptions as drf_exceptions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler as default_drf_exception_handler

from app.shared.exceptions import (
    DomainError,
    InactiveUserError,
    InvalidCredentialsError,
    SessionAlreadyRevokedError,
    SessionNotFoundError,
    UserAlreadyExistsError,
    ValidationError,
)
from app.tasks.domain import (
    TaskCategoryNotFoundError,
    TaskNotFoundError,
    TaskShareNotFoundError,
)

EXCEPTION_STATUS_MAP = {
    ValidationError: status.HTTP_400_BAD_REQUEST,
    InvalidCredentialsError: status.HTTP_401_UNAUTHORIZED,
    InactiveUserError: status.HTTP_401_UNAUTHORIZED,
    UserAlreadyExistsError: status.HTTP_409_CONFLICT,
    SessionNotFoundError: status.HTTP_404_NOT_FOUND,
    SessionAlreadyRevokedError: status.HTTP_409_CONFLICT,
    TaskCategoryNotFoundError: status.HTTP_404_NOT_FOUND,
    TaskNotFoundError: status.HTTP_404_NOT_FOUND,
    TaskShareNotFoundError: status.HTTP_404_NOT_FOUND,
}

EXCEPTION_CODE_MAP = {
    # ValidationIssue.code is the source of truth for per-field/per-item validation
    # responses. This map is only for exceptions returned as a single detail object.
    ValidationError: "validation_error",
    InvalidCredentialsError: "invalid_credentials",
    InactiveUserError: "inactive_user",
    UserAlreadyExistsError: "user_already_exists",
    SessionNotFoundError: "session_not_found",
    SessionAlreadyRevokedError: "session_already_revoked",
    TaskCategoryNotFoundError: "task_category_not_found",
    TaskNotFoundError: "task_not_found",
    TaskShareNotFoundError: "task_share_not_found",
}


def _resolve_status_code(exc: DomainError) -> int:
    for exception_type, mapped_status in EXCEPTION_STATUS_MAP.items():
        if isinstance(exc, exception_type):
            return mapped_status
    return status.HTTP_400_BAD_REQUEST


def _resolve_error_code(exc: Exception) -> str:
    for exception_type, mapped_code in EXCEPTION_CODE_MAP.items():
        if isinstance(exc, exception_type):
            return mapped_code
    return "domain_error"


def drf_exception_handler(exc, _context):
    if isinstance(exc, drf_exceptions.ValidationError):
        return Response(
            status=422,
            data={"detail": _build_http_validation_errors(exc.detail)},
        )

    if not isinstance(exc, DomainError):
        return default_drf_exception_handler(exc, _context)

    status_code = _resolve_status_code(exc)
    issues = exc.issues if isinstance(exc, ValidationError) else None

    return Response(
        status=status_code,
        data={
            "detail": (
                # ValidationIssue.code is the source of truth for per-field/per-item
                # user-facing error mapping, e.g. "shared_user_not_found".
                [
                    {
                        "field": issue.field,
                        "message": issue.message,
                        "code": issue.code,
                    }
                    for issue in issues
                ]
                if issues
                else {
                    "code": _resolve_error_code(exc),
                    "message": str(exc),
                }
            )
        },
    )


def _build_http_validation_errors(detail) -> list[dict[str, object]]:
    issues: list[dict[str, object]] = []
    _append_http_validation_errors(detail, issues, path=["body"])
    return issues


def _append_http_validation_errors(detail, issues, *, path: list[str]) -> None:
    if isinstance(detail, dict):
        for field, nested_detail in detail.items():
            _append_http_validation_errors(
                nested_detail,
                issues,
                path=[*path, str(field)],
            )
        return

    if isinstance(detail, list):
        for index, nested_detail in enumerate(detail):
            if isinstance(nested_detail, (dict, list)):
                _append_http_validation_errors(
                    nested_detail,
                    issues,
                    path=[*path, str(index)],
                )
                continue

            issues.append(
                {
                    "loc": path,
                    "message": str(nested_detail),
                    "code": getattr(nested_detail, "code", "validation_error"),
                    "msg": str(nested_detail),
                    "type": getattr(nested_detail, "code", "validation_error"),
                }
            )
        return

    issues.append(
        {
            "loc": path,
            "message": str(detail),
            "code": getattr(detail, "code", "validation_error"),
            "msg": str(detail),
            "type": getattr(detail, "code", "validation_error"),
        }
    )
