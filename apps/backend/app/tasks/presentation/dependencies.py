"""Dependency resolution helpers for the tasks presentation layer.

This module keeps API views decoupled from direct container wiring while still
allowing lightweight test overrides. In production, each getter resolves the
requested dependency from ``build_container()``. In tests, callers may register
an override by name so the view receives a fake use case or adapter instead of
the real implementation.
"""

from typing import Any

from app.tasks.application.use_cases import (
    CreateTaskCategoryUseCase,
    CreateTasksUseCase,
    ListTaskCategoriesUseCase,
    ListTasksUseCase,
)
from app.container import build_container

_OVERRIDES: dict[str, Any] = {}


def clear_dependency_overrides() -> None:
    """Remove all test-time dependency overrides."""

    _OVERRIDES.clear()


def set_dependency_override(name: str, value: Any) -> None:
    """Register a replacement dependency for tests.

    Args:
        name: Logical dependency name used by the corresponding getter.
        value: Concrete fake/stub instance, or a callable returning one.
    """

    _OVERRIDES[name] = value


def get_list_tasks_use_case() -> ListTasksUseCase:
    """Resolve the register-user use case for the current request path."""

    return _resolve(
        "list_tasks_use_case",
        lambda: build_container().list_tasks_use_case,
    )


def get_create_tasks_use_case() -> CreateTasksUseCase:
    """Resolve the create-tasks use case for the current request path."""

    return _resolve(
        "create_tasks_use_case",
        lambda: build_container().create_tasks_use_case,
    )


def get_create_task_category_use_case() -> CreateTaskCategoryUseCase:
    """Resolve the create-task-category use case for the current request path."""

    return _resolve(
        "create_task_category_use_case",
        lambda: build_container().create_task_category_use_case,
    )


def get_list_task_categories_use_case() -> ListTaskCategoriesUseCase:
    """Resolve the list-task-categories use case for the current request path."""

    return _resolve(
        "list_task_categories_use_case",
        lambda: build_container().list_task_categories_use_case,
    )


def _resolve(name: str, factory) -> Any:
    """Return a test override when present, otherwise build the real dependency."""

    if name not in _OVERRIDES:
        return factory()

    value = _OVERRIDES[name]
    return value() if callable(value) else value
