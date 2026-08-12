"""API tests for the task-create endpoint."""

import json
from dataclasses import dataclass
from datetime import UTC, datetime

from app.auth.domain.entities import User
from app.auth.domain.value_objects import Email
from app.auth.presentation.dependencies import set_dependency_override as set_auth
from app.shared.exceptions import ValidationIssue
from app.tasks.application.dto.create_tasks_input import (
    CreateTaskItemInput,
    CreateTasksInput,
)
from app.tasks.application.dto.create_tasks_output import CreatedTasks
from app.tasks.application.dto.list_tasks_output import (
    TaskCategoryListItem,
    TaskListItem,
    TaskSharingSummary,
)
from app.tasks.domain import InvalidTaskPayloadError
from app.tasks.presentation.dependencies import set_dependency_override as set_tasks


@dataclass
class FakeCreateTasksUseCase:
    """Test double for the create-tasks use case."""

    result: CreatedTasks | None = None
    error: Exception | None = None
    calls: list[CreateTasksInput] | None = None

    def __post_init__(self) -> None:
        if self.calls is None:
            self.calls = []

    def execute(self, input_dto: CreateTasksInput) -> CreatedTasks:
        assert self.calls is not None
        self.calls.append(input_dto)
        if self.error is not None:
            raise self.error
        if self.result is None:
            raise AssertionError("test fake requires a result or error")
        return self.result


@dataclass
class FakeAccessTokenDecoder:
    """Test double for access-token decoding during authentication."""

    user_id: str = "user-123"
    session_id: str = "session-456"
    error: Exception | None = None

    def get_user_id(self, _token: str) -> str:
        if self.error is not None:
            raise self.error
        return self.user_id

    def get_session_id(self, _token: str) -> str:
        if self.error is not None:
            raise self.error
        return self.session_id


@dataclass
class FakeUserRepository:
    """Test double for looking up the authenticated user."""

    user: User | None

    def find_by_id(self, user_id: str) -> User | None:
        return self.user if self.user and self.user.id == user_id else None

    def find_by_email(self, _email: Email) -> User | None:
        return None

    def save(self, user: User) -> User:
        return user


def test_create_tasks_returns_401_when_authorization_header_is_missing(client) -> None:
    response = client.post(
        "/api/tasks/",
        data=json.dumps({"items": [{"title": "Write endpoint tests"}]}),
        content_type="application/json",
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication credentials were not provided."}


def test_create_tasks_returns_401_for_invalid_access_token(client) -> None:
    set_auth("access_token_decoder", FakeAccessTokenDecoder(error=ValueError("bad token")))
    set_auth("user_repository", FakeUserRepository(user=None))

    response = client.post(
        "/api/tasks/",
        data=json.dumps({"items": [{"title": "Write endpoint tests"}]}),
        content_type="application/json",
        headers={"Authorization": "Bearer invalid-access-token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "invalid access token"}


def test_create_tasks_uses_request_user_id_from_authenticated_token(client) -> None:
    set_auth(
        "access_token_decoder",
        FakeAccessTokenDecoder(user_id="user-123", session_id="session-456"),
    )
    set_auth(
        "user_repository",
        FakeUserRepository(
            user=User(
                id="user-123",
                email=Email("user@example.com"),
                password_hash="stored-hash",
                created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
            )
        ),
    )
    fake_use_case = FakeCreateTasksUseCase(
        result=CreatedTasks(
            items=[
                TaskListItem(
                    id="task-1",
                    title="Review POST /api/tasks/",
                    description=None,
                    is_completed=False,
                    created_at="2026-03-04T10:30:00+00:00",
                    updated_at="2026-03-04T10:30:00+00:00",
                    category=TaskCategoryListItem(
                        id="cat-1",
                        name="Backend",
                        color="#0055AA",
                    ),
                    sharing=TaskSharingSummary(
                        is_owner=True,
                        permission=None,
                        is_shared=False,
                        shared_count=0,
                    ),
                )
            ]
        )
    )
    set_tasks("create_tasks_use_case", fake_use_case)

    response = client.post(
        "/api/tasks/",
        data=json.dumps(
            {
                "items": [
                    {
                        "title": "Review POST /api/tasks/",
                        "description": "",
                        "category_id": "cat-1",
                    }
                ]
            }
        ),
        content_type="application/json",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 201
    assert response.json() == {
        "count": 1,
        "results": [
            {
                "id": "task-1",
                "title": "Review POST /api/tasks/",
                "description": None,
                "is_completed": False,
                "created_at": "2026-03-04T10:30:00+00:00",
                "updated_at": "2026-03-04T10:30:00+00:00",
                "category": {
                    "id": "cat-1",
                    "name": "Backend",
                    "color": "#0055AA",
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
    assert fake_use_case.calls is not None
    assert len(fake_use_case.calls) == 1
    assert fake_use_case.calls[0].user_id == "user-123"
    assert fake_use_case.calls[0].items == [
        CreateTaskItemInput(
            title="Review POST /api/tasks/",
            description=None,
            category_id="cat-1",
            is_completed=False,
        )
    ]


def test_create_tasks_returns_400_for_domain_validation_error(client) -> None:
    set_auth(
        "access_token_decoder",
        FakeAccessTokenDecoder(user_id="user-123", session_id="session-456"),
    )
    set_auth(
        "user_repository",
        FakeUserRepository(
            user=User(
                id="user-123",
                email=Email("user@example.com"),
                password_hash="stored-hash",
                created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
            )
        ),
    )
    set_tasks(
        "create_tasks_use_case",
        FakeCreateTasksUseCase(
            error=InvalidTaskPayloadError(
                [
                    ValidationIssue(
                        field="items.0.category_id",
                        message=(
                            "category does not exist or is not owned by the authenticated user"
                        ),
                    )
                ]
            )
        ),
    )

    response = client.post(
        "/api/tasks/",
        data=json.dumps(
            {
                "items": [
                    {
                        "title": "Review POST /api/tasks/",
                        "category_id": "cat-missing",
                    }
                ]
            }
        ),
        content_type="application/json",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": [
            {
                "field": "items.0.category_id",
                "message": "category does not exist or is not owned by the authenticated user",
            }
        ]
    }


def test_create_tasks_returns_422_for_request_validation_error(client) -> None:
    set_auth(
        "access_token_decoder",
        FakeAccessTokenDecoder(user_id="user-123", session_id="session-456"),
    )
    set_auth(
        "user_repository",
        FakeUserRepository(
            user=User(
                id="user-123",
                email=Email("user@example.com"),
                password_hash="stored-hash",
                created_at=datetime(2026, 3, 4, 10, 30, tzinfo=UTC),
            )
        ),
    )
    fake_use_case = FakeCreateTasksUseCase(result=CreatedTasks(items=[]))
    set_tasks("create_tasks_use_case", fake_use_case)

    response = client.post(
        "/api/tasks/",
        data=json.dumps({"items": []}),
        content_type="application/json",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == [
        "body",
        "items",
        "non_field_errors",
    ]
    assert fake_use_case.calls == []
