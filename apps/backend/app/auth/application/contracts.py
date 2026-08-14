from typing import Protocol


class AccessTokenDecoder(Protocol):
    def get_user_id(self, token: str) -> str:
        raise NotImplementedError

    def get_session_id(self, token: str) -> str:
        raise NotImplementedError


class AccessTokenIssuer(Protocol):
    def issue(self, subject: str, session_id: str) -> str:
        raise NotImplementedError


class PasswordHasher(Protocol):
    def hash(self, password: str) -> str:
        raise NotImplementedError

    def verify(self, password: str, encoded_hash: str) -> bool:
        raise NotImplementedError
