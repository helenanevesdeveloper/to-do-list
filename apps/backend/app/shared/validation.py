"""Shared validation helpers."""

from datetime import datetime
from typing import TypeVar

from app.shared.exceptions import EmptyFieldError, ValidationError

T = TypeVar("T")


def require_non_empty_string(
    value: object,
    *,
    field_name: str,
    error_type: type[Exception] = EmptyFieldError,
    message: str | None = None,
) -> str:
    if not isinstance(value, str) or not value.strip():
        raise error_type(message or f"{field_name} cannot be empty")
    return value


def require_instance(
    value: object,
    expected_type: type[T],
    *,
    field_name: str,
    message: str | None = None,
) -> T:
    if not isinstance(value, expected_type):
        raise ValidationError(
            message or f"{field_name} must be a {expected_type.__name__}"
        )
    return value


def require_optional_instance(
    value: object,
    expected_type: type[T],
    *,
    field_name: str,
    message: str | None = None,
) -> T | None:
    if value is None:
        return None
    return require_instance(
        value,
        expected_type,
        field_name=field_name,
        message=message,
    )


def require_datetime(value: object, *, field_name: str) -> datetime:
    return require_instance(value, datetime, field_name=field_name)


def require_optional_datetime(
    value: object,
    *,
    field_name: str,
    message: str | None = None,
) -> datetime | None:
    return require_optional_instance(
        value,
        datetime,
        field_name=field_name,
        message=message,
    )


def require_optional_int(
    value: object,
    *,
    field_name: str,
    message: str | None = None,
) -> int | None:
    return require_optional_instance(
        value,
        int,
        field_name=field_name,
        message=message,
    )
