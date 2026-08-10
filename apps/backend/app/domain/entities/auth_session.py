from dataclasses import dataclass
from datetime import datetime

from app.domain.exceptions import ValidationError
from app.domain.validation import (
    require_datetime,
    require_non_empty_string,
    require_optional_datetime,
)


@dataclass(slots=True)
class AuthSession:
    id: str
    user_id: str
    created_at: datetime
    expires_at: datetime
    revoked_at: datetime | None = None

    def __post_init__(self) -> None:
        require_non_empty_string(self.id, field_name="id")
        require_non_empty_string(self.user_id, field_name="user_id")
        require_datetime(self.created_at, field_name="created_at")
        require_datetime(self.expires_at, field_name="expires_at")
        require_optional_datetime(
            self.revoked_at,
            field_name="revoked_at",
            message="revoked_at must be a datetime or None",
        )
        if self.expires_at <= self.created_at:
            raise ValidationError("expires_at must be after created_at")
