from typing import Protocol

from app.domain.entities.user import User
from app.domain.value_objects.email import Email


class UserRepository(Protocol):
    def find_by_id(self, user_id: str) -> User | None:
        raise NotImplementedError

    def find_by_email(self, email: Email) -> User | None:
        raise NotImplementedError

    def save(self, user: User) -> User:
        raise NotImplementedError
