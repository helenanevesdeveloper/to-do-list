import pytest

from app.domain.exceptions import EmptyFieldError, InvalidEmailError
from app.domain.value_objects.email import Email


def test_normalizes_email_value() -> None:
    email = Email("  User.Name+Tag@Example.COM  ")

    assert email.value == "user.name+tag@example.com"
    assert str(email) == "user.name+tag@example.com"


def test_raises_for_empty_email() -> None:
    with pytest.raises(EmptyFieldError, match="email cannot be empty"):
        Email("   ")


@pytest.mark.parametrize(
    "value",
    ["invalid-email.example.com", "user@example"],
)
def test_raises_for_invalid_email_formats(value: str) -> None:
    with pytest.raises(
        InvalidEmailError, match="email must be a valid email address"
    ):
        Email(value)
