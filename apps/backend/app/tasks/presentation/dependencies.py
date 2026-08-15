"""Dependency resolution helpers for the tasks presentation layer."""

from app.tasks.application.use_cases import (
    CreateTaskCategoryUseCase,
    CreateTaskShareUseCase,
    CreateTasksUseCase,
    DeleteTaskCategoriesUseCase,
    DeleteTaskShareUseCase,
    DeleteTasksUseCase,
    ListTaskCategoriesUseCase,
    ListTaskSharesUseCase,
    ListTasksUseCase,
    UpdateTaskCategoryUseCase,
    UpdateTaskUseCase,
)
from app.container import build_container


def get_list_tasks_use_case() -> ListTasksUseCase:
    """Resolve the register-user use case for the current request path."""

    return build_container().list_tasks_use_case


def get_create_tasks_use_case() -> CreateTasksUseCase:
    """Resolve the create-tasks use case for the current request path."""

    return build_container().create_tasks_use_case


def get_create_task_share_use_case() -> CreateTaskShareUseCase:
    """Resolve the create-task-share use case for the current request path."""

    return build_container().create_task_share_use_case


def get_delete_task_share_use_case() -> DeleteTaskShareUseCase:
    """Resolve the delete-task-share use case for the current request path."""

    return build_container().delete_task_share_use_case


def get_delete_tasks_use_case() -> DeleteTasksUseCase:
    """Resolve the delete-tasks use case for the current request path."""

    return build_container().delete_tasks_use_case


def get_list_task_shares_use_case() -> ListTaskSharesUseCase:
    """Resolve the list-task-shares use case for the current request path."""

    return build_container().list_task_shares_use_case


def get_create_task_category_use_case() -> CreateTaskCategoryUseCase:
    """Resolve the create-task-category use case for the current request path."""

    return build_container().create_task_category_use_case


def get_update_task_use_case() -> UpdateTaskUseCase:
    """Resolve the update-task use case for the current request path."""

    return build_container().update_task_use_case


def get_delete_task_categories_use_case() -> DeleteTaskCategoriesUseCase:
    """Resolve the delete-task-categories use case for the current request path."""

    return build_container().delete_task_categories_use_case


def get_update_task_category_use_case() -> UpdateTaskCategoryUseCase:
    """Resolve the update-task-category use case for the current request path."""

    return build_container().update_task_category_use_case


def get_list_task_categories_use_case() -> ListTaskCategoriesUseCase:
    """Resolve the list-task-categories use case for the current request path."""

    return build_container().list_task_categories_use_case
