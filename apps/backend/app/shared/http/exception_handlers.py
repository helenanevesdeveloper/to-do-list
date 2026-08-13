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
from app.tasks.domain import TaskCategoryNotFoundError, TaskNotFoundError

EXCEPTION_STATUS_MAP = {
    ValidationError: status.HTTP_400_BAD_REQUEST,
    InvalidCredentialsError: status.HTTP_401_UNAUTHORIZED,
    InactiveUserError: status.HTTP_401_UNAUTHORIZED,
    UserAlreadyExistsError: status.HTTP_409_CONFLICT,
    SessionNotFoundError: status.HTTP_404_NOT_FOUND,
    SessionAlreadyRevokedError: status.HTTP_409_CONFLICT,
    TaskCategoryNotFoundError: status.HTTP_404_NOT_FOUND,
    TaskNotFoundError: status.HTTP_404_NOT_FOUND,
}


def _resolve_status_code(exc: DomainError) -> int:
    for exception_type, mapped_status in EXCEPTION_STATUS_MAP.items():
        if isinstance(exc, exception_type):
            return mapped_status
    return status.HTTP_400_BAD_REQUEST


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
                [
                    {"field": issue.field, "message": issue.message}
                    for issue in issues
                ]
                if issues
                else str(exc)
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
                    "msg": str(nested_detail),
                    "type": getattr(nested_detail, "code", "validation_error"),
                }
            )
        return

    issues.append(
        {
            "loc": path,
            "msg": str(detail),
            "type": getattr(detail, "code", "validation_error"),
        }
    )
