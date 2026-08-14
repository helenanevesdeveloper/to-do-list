import os
from dataclasses import dataclass
from functools import lru_cache

from app.auth.application.contracts import AccessTokenDecoder
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

from app.tasks.application.use_cases.create_task_category import CreateTaskCategoryUseCase
from app.tasks.application.use_cases.create_task_share import CreateTaskShareUseCase
from app.tasks.application.use_cases.create_tasks import CreateTasksUseCase
from app.tasks.application.use_cases.delete_task_categories import (
    DeleteTaskCategoriesUseCase,
)
from app.tasks.application.use_cases.delete_task_share import DeleteTaskShareUseCase
from app.tasks.application.use_cases.delete_tasks import DeleteTasksUseCase
from app.tasks.application.use_cases.list_task_categories import ListTaskCategoriesUseCase
from app.tasks.application.use_cases.list_task_shares import ListTaskSharesUseCase
from app.tasks.application.use_cases.list_tasks import ListTasksUseCase
from app.tasks.application.use_cases.update_task_category import (
    UpdateTaskCategoryUseCase,
)
from app.tasks.application.use_cases.update_task import UpdateTaskUseCase
from app.tasks.infrastructure.repositories.task_category_command_repository import (
    TaskCategoryCommandRepository,
)
from app.tasks.infrastructure.repositories.task_category_query_repository import (
    TaskCategoryQueryRepository,
)
from app.tasks.infrastructure.repositories.task_command_repository import (
    TaskCommandRepository,
)
from app.tasks.infrastructure.repositories.task_query_repository import (
    TaskQueryRepository,
)


@dataclass(slots=True, frozen=True)
class AppContainer:
    register_user_use_case: RegisterUserUseCase
    authenticate_user_use_case: AuthenticateUserUseCase
    logout_use_case: LogoutUseCase
    access_token_decoder: AccessTokenDecoder
    user_repository: PostgresUserRepository
    create_task_category_use_case: CreateTaskCategoryUseCase
    create_task_share_use_case: CreateTaskShareUseCase
    delete_task_categories_use_case: DeleteTaskCategoriesUseCase
    delete_task_share_use_case: DeleteTaskShareUseCase
    update_task_category_use_case: UpdateTaskCategoryUseCase
    create_tasks_use_case: CreateTasksUseCase
    delete_tasks_use_case: DeleteTasksUseCase
    list_task_shares_use_case: ListTaskSharesUseCase
    list_task_categories_use_case: ListTaskCategoriesUseCase
    list_tasks_use_case: ListTasksUseCase
    update_task_use_case: UpdateTaskUseCase


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

    task_category_command_repository = TaskCategoryCommandRepository()
    task_category_query_repository = TaskCategoryQueryRepository()
    task_command_repository = TaskCommandRepository()
    task_query_repository = TaskQueryRepository()

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
        user_repository=user_repository,
        create_task_category_use_case=CreateTaskCategoryUseCase(
            task_category_command_repository=task_category_command_repository
        ),
        create_task_share_use_case=CreateTaskShareUseCase(
            task_command_repository=task_command_repository
        ),
        delete_task_categories_use_case=DeleteTaskCategoriesUseCase(
            task_category_command_repository=task_category_command_repository
        ),
        delete_task_share_use_case=DeleteTaskShareUseCase(
            task_command_repository=task_command_repository
        ),
        update_task_category_use_case=UpdateTaskCategoryUseCase(
            task_category_command_repository=task_category_command_repository
        ),
        create_tasks_use_case=CreateTasksUseCase(
            task_command_repository=task_command_repository
        ),
        delete_tasks_use_case=DeleteTasksUseCase(
            task_command_repository=task_command_repository
        ),
        list_task_shares_use_case=ListTaskSharesUseCase(
            task_query_repository=task_query_repository
        ),
        list_task_categories_use_case=ListTaskCategoriesUseCase(
            task_category_query_repository=task_category_query_repository
        ),
        list_tasks_use_case=ListTasksUseCase(
            task_query_repository=task_query_repository
        ),
        update_task_use_case=UpdateTaskUseCase(
            task_command_repository=task_command_repository
        ),
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
