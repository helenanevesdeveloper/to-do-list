from typing import Protocol


class AccessTokenDecoder(Protocol):
    def get_user_id(self, token: str) -> str:
        raise NotImplementedError

    def get_session_id(self, token: str) -> str:
        raise NotImplementedError
