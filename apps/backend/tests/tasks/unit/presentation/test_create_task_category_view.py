"""Unit tests for the task category creation API view."""

from types import SimpleNamespace
from typing import Any, cast
from unittest.mock import Mock

from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate

from app.tasks.application.dto.create_task_category_input import CreateTaskCategoryInput
from app.tasks.application.dto.create_task_category_output import CreatedTaskCategory
from app.tasks.presentation.views import TaskCategoryListView


def test_task_category_create_normalizes_blank_color_to_none(monkeypatch) -> None:
    """Converts an empty color field into None before calling the use case."""

    use_case = Mock()
    use_case.execute.return_value = CreatedTaskCategory(
        id="cat-7",
        name="Personal",
        color=None,
        created_at="2026-03-30T10:00:00+00:00",
        updated_at="2026-03-30T10:00:00+00:00",
    )
    monkeypatch.setattr(
        "app.tasks.presentation.views.build_container",
        lambda: SimpleNamespace(create_task_category_use_case=use_case),
    )

    request = APIRequestFactory().post(
        "/api/tasks/categories/",
        {
            "name": "Personal",
            "color": "",
        },
        format="json",
    )
    user = get_user_model()(id=cast(Any, "user-123"), username="task-owner")
    force_authenticate(request, user=user)

    response = TaskCategoryListView.as_view()(request)

    assert response.status_code == 201
    assert response.data == {
        "id": "cat-7",
        "name": "Personal",
        "color": None,
        "created_at": "2026-03-30T10:00:00+00:00",
        "updated_at": "2026-03-30T10:00:00+00:00",
    }
    use_case.execute.assert_called_once_with(
        CreateTaskCategoryInput(
            user_id="user-123",
            name="Personal",
            color=None,
        )
    )
