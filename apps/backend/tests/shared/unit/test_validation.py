from datetime import UTC, datetime

import pytest

from app.shared.exceptions import EmptyFieldError, ValidationError
from app.shared.validation import (
    require_datetime,
    require_instance,
    require_non_empty_string,
    require_optional_datetime,
)


def test_require_non_empty_string_returns_original_value() -> None:
    value = require_non_empty_string(" session-123 ", field_name="id")

    assert value == " session-123 "


def test_require_non_empty_string_raises_for_blank_value() -> None:
    with pytest.raises(EmptyFieldError, match="id cannot be empty"):
        require_non_empty_string("   ", field_name="id")


def test_require_instance_returns_typed_value() -> None:
    created_at = datetime(2026, 3, 26, 10, 0, tzinfo=UTC)

    value = require_instance(created_at, datetime, field_name="created_at")

    assert value is created_at


def test_require_instance_raises_for_wrong_type() -> None:
    with pytest.raises(ValidationError, match="created_at must be a datetime"):
        require_instance("2026-03-26T10:00:00Z", datetime, field_name="created_at")


def test_require_optional_datetime_accepts_none() -> None:
    assert require_optional_datetime(None, field_name="revoked_at") is None


def test_require_datetime_raises_for_wrong_type() -> None:
    with pytest.raises(ValidationError, match="created_at must be a datetime"):
        require_datetime("2026-03-26T10:00:00Z", field_name="created_at")
