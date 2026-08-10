import pytest

from app.domain.exceptions import EmptyFieldError, WeakPasswordError
from app.domain.services.password_policy import PasswordPolicy


def test_accepts_password_that_meets_default_policy() -> None:
    policy = PasswordPolicy()

    policy.validate("StrongPass1")


def test_raises_for_empty_password() -> None:
    policy = PasswordPolicy()

    with pytest.raises(EmptyFieldError, match="password cannot be empty"):
        policy.validate("")


@pytest.mark.parametrize(
    ("password", "message"),
    [
        ("Abc123", "password must be at least 8 characters long"),
        (
            "lowercase1",
            "password must contain at least one uppercase letter",
        ),
        (
            "UPPERCASE1",
            "password must contain at least one lowercase letter",
        ),
        ("NoDigitsHere", "password must contain at least one digit"),
    ],
)
def test_raises_for_invalid_passwords(password: str, message: str) -> None:
    policy = PasswordPolicy()

    with pytest.raises(WeakPasswordError, match=message):
        policy.validate(password)


def test_aggregates_multiple_password_validation_errors() -> None:
    policy = PasswordPolicy()

    with pytest.raises(WeakPasswordError) as error:
        policy.validate("abc")

    assert str(error.value) == "password must be at least 8 characters long"
    assert error.value.issues is not None
    assert [issue.message for issue in error.value.issues] == [
        "password must be at least 8 characters long",
        "password must contain at least one uppercase letter",
        "password must contain at least one digit",
    ]


def test_respects_custom_policy_configuration() -> None:
    policy = PasswordPolicy(
        min_length=4,
        require_uppercase=False,
        require_lowercase=False,
        require_digit=False,
    )

    policy.validate("abcd")
