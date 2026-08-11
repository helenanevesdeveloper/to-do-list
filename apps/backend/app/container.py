import os
from dataclasses import dataclass
from functools import lru_cache

from app.auth.application.ports import AccessTokenDecoder
from app.auth.application.use_cases import (
    AuthenticateUserUseCase,
    LogoutUseCase,
    RegisterUserUseCase,
)
from app.auth.domain.services import PasswordPolicy
from app.environment import load_environment
from app.auth.infrastructure.repositories import (
    PostgresSessionRepository,
    PostgresUserRepository,
)
from app.auth.infrastructure.security import (
    JwtAccessTokenDecoder,
    JwtAccessTokenIssuer,
    PBKDF2PasswordHasher,
)


@dataclass(slots=True, frozen=True)
class AppContainer:
    register_user_use_case: RegisterUserUseCase
    authenticate_user_use_case: AuthenticateUserUseCase
    logout_use_case: LogoutUseCase
    access_token_decoder: AccessTokenDecoder


@lru_cache
def build_container() -> AppContainer:
    load_environment()
    database_url = _get_required_env(
        "DATABASE_URL",
        message=(
            "DATABASE_URL is not configured. Set it in the environment or in "
            "apps/backend/.env."
        ),
    )
    password_hash_iterations = _get_positive_int_env(
        "PASSWORD_HASH_ITERATIONS",
        default=600_000,
    )
    password_hash_salt_bytes = _get_positive_int_env(
        "PASSWORD_HASH_SALT_BYTES",
        default=16,
    )
    jwt_secret = _get_required_env("JWT_SECRET")
    jwt_issuer = _get_required_env("JWT_ISSUER")
    jwt_audience = _get_required_env("JWT_AUDIENCE")
    access_token_expires_seconds = _get_positive_int_env(
        "ACCESS_TOKEN_EXPIRES_SECONDS",
        default=900,
    )

    user_repository = PostgresUserRepository(database_url=database_url)
    session_repository = PostgresSessionRepository(database_url=database_url)
    password_policy = PasswordPolicy()
    password_hasher = PBKDF2PasswordHasher(
        iterations=password_hash_iterations,
        salt_bytes=password_hash_salt_bytes,
    )
    access_token_issuer = JwtAccessTokenIssuer(
        secret=jwt_secret,
        issuer=jwt_issuer,
        audience=jwt_audience,
        expires_in_seconds=access_token_expires_seconds,
    )
    access_token_decoder = JwtAccessTokenDecoder(
        secret=jwt_secret,
        issuer=jwt_issuer,
        audience=jwt_audience,
    )

    return AppContainer(
        register_user_use_case=RegisterUserUseCase(
            user_repository=user_repository,
            password_policy=password_policy,
            password_hasher=password_hasher,
        ),
        authenticate_user_use_case=AuthenticateUserUseCase(
            user_repository=user_repository,
            session_repository=session_repository,
            password_hasher=password_hasher,
            access_token_issuer=access_token_issuer,
            access_token_expires_seconds=access_token_expires_seconds,
        ),
        logout_use_case=LogoutUseCase(
            session_repository=session_repository,
        ),
        access_token_decoder=access_token_decoder,
    )


def _get_positive_int_env(name: str, *, default: int) -> int:
    raw_value = os.getenv(name)
    if raw_value is None or not raw_value.strip():
        return default

    value = int(raw_value)
    if value <= 0:
        raise RuntimeError(f"{name} must be a positive integer")
    return value


def _get_required_env(name: str, *, message: str | None = None) -> str:
    value = os.getenv(name)
    if value is None or not value.strip():
        raise RuntimeError(message or f"{name} is not configured")
    return value
