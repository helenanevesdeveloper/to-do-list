from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime, timedelta

from app.application.dto.authenticate_user_input import AuthenticateUserInput
from app.application.dto.authenticate_user_output import AuthenticateUserOutput
from app.application.ports.access_token_issuer import AccessTokenIssuer
from app.application.ports.password_hasher import PasswordHasher
from app.application.ports.session_repository import SessionRepository
from app.application.ports.user_repository import UserRepository
from app.application.runtime import generate_uuid, utc_now
from app.domain.entities.auth_session import AuthSession
from app.domain.exceptions import InactiveUserError, InvalidCredentialsError
from app.domain.value_objects.email import Email


@dataclass(slots=True)
class AuthenticateUserUseCase:
    user_repository: UserRepository
    session_repository: SessionRepository
    password_hasher: PasswordHasher
    access_token_issuer: AccessTokenIssuer
    access_token_expires_seconds: int = 900
    token_type: str = "Bearer"
    generate_session_id: Callable[[], str] = field(default=generate_uuid)
    now: Callable[[], datetime] = field(default=utc_now)

    def execute(
        self,
        input_dto: AuthenticateUserInput,
    ) -> AuthenticateUserOutput:
        normalized_email = Email(input_dto.email)
        user = self.user_repository.find_by_email(normalized_email)

        if user is None:
            raise InvalidCredentialsError("invalid email or password")

        password_matches = self.password_hasher.verify(
            input_dto.password,
            user.password_hash,
        )
        if not password_matches:
            raise InvalidCredentialsError("invalid email or password")

        if not user.is_active:
            raise InactiveUserError("user is inactive")

        created_at = self.now()
        session_id = self.generate_session_id()
        session = AuthSession(
            id=session_id,
            user_id=user.id,
            created_at=created_at,
            expires_at=created_at
            + timedelta(seconds=self.access_token_expires_seconds),
        )
        self.session_repository.save(session)

        access_token = self.access_token_issuer.issue(user.id, session.id)
        return AuthenticateUserOutput(
            access_token=access_token,
            token_type=self.token_type,
        )
