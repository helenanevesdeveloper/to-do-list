from typing import Protocol


class AccessTokenIssuer(Protocol):
    def issue(self, subject: str, session_id: str) -> str:
        raise NotImplementedError
