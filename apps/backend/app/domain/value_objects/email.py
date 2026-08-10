import re
from dataclasses import dataclass

from app.domain.exceptions import InvalidEmailError
from app.domain.validation import require_non_empty_string

EMAIL_PATTERN = re.compile(
    r"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$",
    re.IGNORECASE,
)


@dataclass(slots=True, frozen=True)
class Email:
    value: str

    def __post_init__(self) -> None:
        normalized_value = require_non_empty_string(
            self.value,
            field_name="email",
        ).strip().lower()
        if not EMAIL_PATTERN.fullmatch(normalized_value):
            raise InvalidEmailError("email must be a valid email address")

        object.__setattr__(self, "value", normalized_value)

    def __str__(self) -> str:
        return self.value
