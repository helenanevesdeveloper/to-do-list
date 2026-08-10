from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime

from app.application.ports.password_hasher import PasswordHasher
from app.application.ports.user_repository import UserRepository
from app.application.runtime import generate_uuid, utc_now
from app.application.dto.register_user_input import RegisterUserInput
from app.application.dto.register_user_output import RegisterUserOutput
from app.domain.entities.user import User
from app.domain.exceptions import UserAlreadyExistsError
from app.domain.services.password_policy import PasswordPolicy
from app.domain.value_objects.email import Email


@dataclass(slots=True)
class RegisterUserUseCase:
    user_repository: UserRepository
    password_policy: PasswordPolicy
    password_hasher: PasswordHasher
    generate_user_id: Callable[[], str] = field(default=generate_uuid)
    now: Callable[[], datetime] = field(default=utc_now)

    def execute(self, input_dto: RegisterUserInput) -> RegisterUserOutput:
        normalized_email = Email(input_dto.email)
        self.password_policy.validate(input_dto.password)

        existing_user = self.user_repository.find_by_email(normalized_email)
        if existing_user is not None:
            raise UserAlreadyExistsError("user with this email already exists")

        user = User(
            id=self.generate_user_id(),
            email=normalized_email,
            password_hash=self.password_hasher.hash(input_dto.password),
            created_at=self.now(),
        )
        saved_user = self.user_repository.save(user)
        return RegisterUserOutput(
            id=saved_user.id,
            email=str(saved_user.email),
            created_at=saved_user.created_at.isoformat(),
            is_active=saved_user.is_active,
        )
