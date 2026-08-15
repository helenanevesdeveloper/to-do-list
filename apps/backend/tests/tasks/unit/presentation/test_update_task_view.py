"""Unit tests for the task update API view."""

from types import SimpleNamespace
from typing import Any, cast
from unittest.mock import Mock

from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate

from app.tasks.application.dto.list_tasks_output import (
    TaskListItem,
    TaskSharingSummary,
)
from app.tasks.application.dto.update_task_input import UpdateTaskInput
from app.tasks.presentation.views import TaskDetailView


def test_task_update_marks_completed_and_clears_optional_fields(
    monkeypatch,
) -> None:
    """Updates completion state and normalizes blank optional fields."""

    use_case = Mock()
    use_case.execute.return_value = TaskListItem(
        id="task-7",
        title="Prepare report",
        description=None,
        is_completed=True,
        created_at="2026-03-30T10:00:00+00:00",
        updated_at="2026-03-30T10:05:00+00:00",
        category=None,
        sharing=TaskSharingSummary(
            is_owner=True,
            permission=None,
            is_shared=False,
            shared_count=0,
        ),
    )
    monkeypatch.setattr(
        "app.tasks.presentation.views.build_container",
        lambda: SimpleNamespace(update_task_use_case=use_case),
    )

    request = APIRequestFactory().patch(
        "/api/tasks/task-7/",
        {
            "description": "",
            "category_id": "",
            "is_completed": True,
        },
        format="json",
    )
    user = get_user_model()(id=cast(Any, "user-123"), username="task-owner")
    force_authenticate(
        request,
        user=user,
    )

    response = TaskDetailView.as_view()(request, task_id="task-7")

    assert response.status_code == 200
    assert response.data == {
        "id": "task-7",
        "title": "Prepare report",
        "description": None,
        "is_completed": True,
        "created_at": "2026-03-30T10:00:00+00:00",
        "updated_at": "2026-03-30T10:05:00+00:00",
        "category": None,
        "sharing": {
            "is_owner": True,
            "permission": None,
            "is_shared": False,
            "shared_count": 0,
        },
    }
    use_case.execute.assert_called_once_with(
        UpdateTaskInput(
            user_id="user-123",
            task_id="task-7",
            description=None,
            description_provided=True,
            category_id=None,
            category_id_provided=True,
            is_completed=True,
            is_completed_provided=True,
        )
    )
