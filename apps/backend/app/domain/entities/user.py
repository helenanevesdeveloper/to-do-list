from dataclasses import dataclass
from datetime import datetime

from app.domain.exceptions import ValidationError
from app.domain.validation import require_datetime, require_non_empty_string
from app.domain.value_objects.email import Email


@dataclass(slots=True)
class User:
    id: str
    email: Email
    password_hash: str
    created_at: datetime
    is_active: bool = True

    def __post_init__(self) -> None:
        require_non_empty_string(self.id, field_name="id")
        if not isinstance(self.email, Email):
            raise ValidationError("email must be an Email")
        require_non_empty_string(self.password_hash, field_name="password_hash")
        require_datetime(self.created_at, field_name="created_at")
