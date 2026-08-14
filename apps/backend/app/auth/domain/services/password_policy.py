from dataclasses import dataclass

from app.shared.exceptions import ValidationIssue, WeakPasswordError
from app.shared.validation import require_non_empty_string


@dataclass(slots=True, frozen=True)
class PasswordPolicy:
    min_length: int = 8
    require_uppercase: bool = True
    require_lowercase: bool = True
    require_digit: bool = True

    def validate(self, password: str) -> None:
        require_non_empty_string(password, field_name="password")
        errors: list[str] = []
        if len(password) < self.min_length:
            errors.append(
                f"password must be at least {self.min_length} characters long"
            )
        if self.require_uppercase and not any(char.isupper() for char in password):
            errors.append(
                "password must contain at least one uppercase letter"
            )
        if self.require_lowercase and not any(char.islower() for char in password):
            errors.append(
                "password must contain at least one lowercase letter"
            )
        if self.require_digit and not any(char.isdigit() for char in password):
            errors.append("password must contain at least one digit")
        if errors:
            raise WeakPasswordError(
                [
                    ValidationIssue(
                        field="password",
                        message=message,
                        code=_resolve_password_error_code(message),
                    )
                    for message in errors
                ]
            )


def _resolve_password_error_code(message: str) -> str:
    if "at least" in message and "characters long" in message:
        return "password_too_short"
    if "uppercase" in message:
        return "password_missing_uppercase"
    if "lowercase" in message:
        return "password_missing_lowercase"
    if "digit" in message:
        return "password_missing_digit"
    return "weak_password"
