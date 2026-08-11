from datetime import datetime
from typing import Protocol

from app.auth.domain.entities import AuthSession


class SessionRepository(Protocol):
    def find_by_id(self, session_id: str) -> AuthSession | None:
        raise NotImplementedError

    def save(self, session: AuthSession) -> AuthSession:
        raise NotImplementedError

    def revoke(
        self,
        session_id: str,
        revoked_at: datetime,
    ) -> AuthSession | None:
        raise NotImplementedError
