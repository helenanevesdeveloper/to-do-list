from dataclasses import dataclass
from datetime import UTC, datetime

import pytest

from app.application.dto.register_user_input import RegisterUserInput
from app.application.use_cases.register_user import RegisterUserUseCase
from app.domain.entities.user import User
from app.domain.exceptions import (
    InvalidEmailError,
    UserAlreadyExistsError,
    WeakPasswordError,
)
from app.domain.services.password_policy import PasswordPolicy
from app.domain.value_objects.email import Email


@dataclass
class FakeUserRepository:
    existing_user: User | None = None
    saved_user: User | None = None
    last_email_lookup: Email | None = None

    def find_by_id(self, user_id: str) -> User | None:
        return None

    def find_by_email(self, email: Email) -> User | None:
        self.last_email_lookup = email
        return self.existing_user

    def save(self, user: User) -> User:
        self.saved_user = user
        return user


@dataclass
class FakePasswordHasher:
    hashed_value: str = "hashed-password"
    last_password: str | None = None

    def hash(self, password: str) -> str:
        self.last_password = password
        return self.hashed_value

    def verify(self, password: str, encoded_hash: str) -> bool:
        return encoded_hash == self.hashed_value and password == self.last_password


def test_registers_user_successfully() -> None:
    repository = FakeUserRepository()
    password_hasher = FakePasswordHasher(hashed_value="hashed-123")
    created_at = datetime(2026, 3, 4, 10, 30, tzinfo=UTC)
    use_case = RegisterUserUseCase(
        user_repository=repository,
        password_policy=PasswordPolicy(),
        password_hasher=password_hasher,
        generate_user_id=lambda: "user-123",
        now=lambda: created_at,
    )

    result = use_case.execute(
        RegisterUserInput(
            email="  USER@example.com ",
            password="StrongPass1",
        )
    )

    assert repository.last_email_lookup == Email("user@example.com")
    assert repository.saved_user is not None
    assert repository.saved_user.id == "user-123"
    assert str(repository.saved_user.email) == "user@example.com"
    assert repository.saved_user.password_hash == "hashed-123"
    assert repository.saved_user.created_at == created_at
    assert password_hasher.last_password == "StrongPass1"
    assert result.id == "user-123"
    assert result.email == "user@example.com"
    assert result.created_at == created_at.isoformat()
    assert result.is_active is True


def test_raises_when_user_already_exists() -> None:
    existing_user = User(
        id="existing-1",
        email=Email("user@example.com"),
        password_hash="hashed-password",
        created_at=datetime(2026, 3, 4, 9, 0, tzinfo=UTC),
    )
    repository = FakeUserRepository(existing_user=existing_user)
    password_hasher = FakePasswordHasher()
    use_case = RegisterUserUseCase(
        user_repository=repository,
        password_policy=PasswordPolicy(),
        password_hasher=password_hasher,
    )

    with pytest.raises(
        UserAlreadyExistsError, match="user with this email already exists"
    ):
        use_case.execute(
            RegisterUserInput(
                email="user@example.com",
                password="StrongPass1",
            )
        )

    assert repository.saved_user is None
    assert password_hasher.last_password is None


def test_raises_for_invalid_email_before_repository_lookup() -> None:
    repository = FakeUserRepository()
    use_case = RegisterUserUseCase(
        user_repository=repository,
        password_policy=PasswordPolicy(),
        password_hasher=FakePasswordHasher(),
    )

    with pytest.raises(
        InvalidEmailError, match="email must be a valid email address"
    ):
        use_case.execute(
            RegisterUserInput(
                email="invalid-email",
                password="StrongPass1",
            )
        )

    assert repository.last_email_lookup is None
    assert repository.saved_user is None


def test_raises_for_weak_password_before_repository_lookup() -> None:
    repository = FakeUserRepository()
    use_case = RegisterUserUseCase(
        user_repository=repository,
        password_policy=PasswordPolicy(),
        password_hasher=FakePasswordHasher(),
    )

    with pytest.raises(WeakPasswordError) as error:
        use_case.execute(
            RegisterUserInput(
                email="user@example.com",
                password="abc",
            )
        )

    assert str(error.value) == "password must be at least 8 characters long"
    assert error.value.issues is not None
    assert [issue.message for issue in error.value.issues] == [
        "password must be at least 8 characters long",
        "password must contain at least one uppercase letter",
        "password must contain at least one digit",
    ]
    assert repository.last_email_lookup is None
    assert repository.saved_user is None
