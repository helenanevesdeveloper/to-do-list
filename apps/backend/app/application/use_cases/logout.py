from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime

from app.application.dto.logout_input import LogoutInput
from app.application.ports.session_repository import SessionRepository
from app.application.runtime import utc_now
from app.domain.exceptions import (
    SessionAlreadyRevokedError,
    SessionNotFoundError,
)


@dataclass(slots=True)
class LogoutUseCase:
    session_repository: SessionRepository
    now: Callable[[], datetime] = field(default=utc_now)

    def execute(self, input_dto: LogoutInput) -> None:
        session = self.session_repository.find_by_id(input_dto.session_id)

        if session is None:
            raise SessionNotFoundError("session was not found")

        if session.revoked_at is not None:
            raise SessionAlreadyRevokedError("session is already revoked")

        self.session_repository.revoke(
            session_id=input_dto.session_id,
            revoked_at=self.now(),
        )
