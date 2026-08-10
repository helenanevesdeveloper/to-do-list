from dataclasses import dataclass
from datetime import datetime

import psycopg
from psycopg.rows import class_row

from app.application.ports.user_repository import UserRepository
from app.domain.entities.user import User
from app.domain.exceptions import UserAlreadyExistsError
from app.domain.value_objects.email import Email


@dataclass(slots=True, frozen=True)
class UserRow:
    id: str
    email: str
    password_hash: str
    created_at: datetime
    is_active: bool


class PostgresUserRepository(UserRepository):
    def __init__(self, database_url: str) -> None:
        self.database_url = database_url

    def find_by_id(self, user_id: str) -> User | None:
        with psycopg.connect(self.database_url) as connection:
            with connection.cursor(row_factory=class_row(UserRow)) as cursor:
                cursor.execute(
                    """
                    SELECT id, email, password_hash, created_at, is_active
                    FROM users
                    WHERE id = %s
                    """,
                    (user_id,),
                )
                row = cursor.fetchone()

        return None if row is None else self._row_to_user(row)

    def find_by_email(self, email: Email) -> User | None:
        with psycopg.connect(self.database_url) as connection:
            with connection.cursor(row_factory=class_row(UserRow)) as cursor:
                cursor.execute(
                    """
                    SELECT id, email, password_hash, created_at, is_active
                    FROM users
                    WHERE email = %s
                    """,
                    (str(email),),
                )
                row = cursor.fetchone()

        return None if row is None else self._row_to_user(row)

    def save(self, user: User) -> User:
        try:
            with psycopg.connect(self.database_url) as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO users (id, email, password_hash, is_active, created_at)
                        VALUES (%s, %s, %s, %s, %s)
                        """,
                        (
                            user.id,
                            str(user.email),
                            user.password_hash,
                            user.is_active,
                            user.created_at,
                        ),
                    )
        except psycopg.IntegrityError as exc:
            raise UserAlreadyExistsError(
                f"user with email '{user.email}' already exists"
            ) from exc

        return user

    def _row_to_user(self, row: UserRow) -> User:
        user_id = row.id
        email = row.email
        password_hash = row.password_hash
        created_at = row.created_at
        is_active = row.is_active

        if not isinstance(user_id, str):
            raise TypeError("database returned invalid user id")
        if not isinstance(email, str):
            raise TypeError("database returned invalid email")
        if not isinstance(password_hash, str):
            raise TypeError("database returned invalid password hash")
        if not isinstance(created_at, datetime):
            raise TypeError("database returned invalid created_at")
        if not isinstance(is_active, bool):
            raise TypeError("database returned invalid is_active")

        return User(
            id=user_id,
            email=Email(email),
            password_hash=password_hash,
            created_at=created_at,
            is_active=is_active,
        )
