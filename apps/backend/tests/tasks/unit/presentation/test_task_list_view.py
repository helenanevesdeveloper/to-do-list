"""Unit tests for the task list API view."""

from types import SimpleNamespace
from unittest.mock import Mock

from rest_framework.test import APIRequestFactory, force_authenticate

from app.tasks.application.dto.list_tasks_input import ListTasksInput
from app.tasks.application.dto.list_tasks_output import (
    PaginatedTasks,
    TaskCategoryListItem,
    TaskListItem,
    TaskSharingSummary,
)
from app.tasks.presentation.views import TaskListView


def test_task_list_view_applies_filters_and_builds_pagination_links(
    monkeypatch,
) -> None:
    use_case = Mock()
    use_case.execute.return_value = PaginatedTasks(
        items=[
            TaskListItem(
                id="task-2",
                title="Second task",
                description="Review contracts",
                is_completed=True,
                created_at="2026-03-30T10:00:00+00:00",
                updated_at="2026-03-30T10:05:00+00:00",
                category=TaskCategoryListItem(
                    id="cat-1",
                    name="Work",
                    color="#123456",
                ),
                sharing=TaskSharingSummary(
                    is_owner=True,
                    permission=None,
                    is_shared=False,
                    shared_count=0,
                ),
            )
        ],
        total=5,
        page=2,
        page_size=2,
    )
    monkeypatch.setattr(
        "app.tasks.presentation.views.build_container",
        lambda: SimpleNamespace(list_tasks_use_case=use_case),
    )

    request = APIRequestFactory().get(
        "/api/tasks/",
        {
            "page": 2,
            "page_size": 2,
            "scope": "all",
            "is_completed": "true",
            "category_id": "cat-1",
        },
    )
    force_authenticate(
        request,
        user=SimpleNamespace(id="user-123", is_authenticated=True),
    )

    response = TaskListView.as_view()(request)

    assert response.status_code == 200
    assert response.data == {
        "count": 5,
        "next": (
            "http://testserver/api/tasks/?page=3&page_size=2&scope=all"
            "&is_completed=true&category_id=cat-1"
        ),
        "previous": (
            "http://testserver/api/tasks/?page=1&page_size=2&scope=all"
            "&is_completed=true&category_id=cat-1"
        ),
        "results": [
            {
                "id": "task-2",
                "title": "Second task",
                "description": "Review contracts",
                "is_completed": True,
                "created_at": "2026-03-30T10:00:00+00:00",
                "updated_at": "2026-03-30T10:05:00+00:00",
                "category": {
                    "id": "cat-1",
                    "name": "Work",
                    "color": "#123456",
                },
                "sharing": {
                    "is_owner": True,
                    "permission": None,
                    "is_shared": False,
                    "shared_count": 0,
                },
            }
        ],
    }
    use_case.execute.assert_called_once_with(
        ListTasksInput(
            user_id="user-123",
            page=2,
            page_size=2,
            is_completed=True,
            category_id="cat-1",
            scope="all",
        )
    )
