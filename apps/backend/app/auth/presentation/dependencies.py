from typing import Any

from app.auth.application.ports import AccessTokenDecoder
from app.auth.application.use_cases import (
    AuthenticateUserUseCase,
    LogoutUseCase,
    RegisterUserUseCase,
)
from app.container import build_container

_OVERRIDES: dict[str, Any] = {}


def clear_dependency_overrides() -> None:
    _OVERRIDES.clear()


def set_dependency_override(name: str, value: Any) -> None:
    _OVERRIDES[name] = value


def get_register_user_use_case() -> RegisterUserUseCase:
    return _resolve(
        "register_user_use_case",
        lambda: build_container().register_user_use_case,
    )


def get_authenticate_user_use_case() -> AuthenticateUserUseCase:
    return _resolve(
        "authenticate_user_use_case",
        lambda: build_container().authenticate_user_use_case,
    )


def get_logout_use_case() -> LogoutUseCase:
    return _resolve("logout_use_case", lambda: build_container().logout_use_case)


def get_access_token_decoder() -> AccessTokenDecoder:
    return _resolve(
        "access_token_decoder",
        lambda: build_container().access_token_decoder,
    )


def _resolve(name: str, factory) -> Any:
    if name not in _OVERRIDES:
        return factory()

    value = _OVERRIDES[name]
    return value() if callable(value) else value
