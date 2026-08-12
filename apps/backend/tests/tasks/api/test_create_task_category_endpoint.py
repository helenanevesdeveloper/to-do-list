"""API tests for the task-category create endpoint."""

import json
from dataclasses import dataclass
from datetime import UTC, datetime

from app.auth.domain.entities import User
from app.auth.domain.value_objects import Email
from app.auth.presentation.dependencies import set_dependency_override as set_auth
from app.shared.exceptions import ValidationIssue
from app.tasks.application.dto.create_task_category_input import CreateTaskCategoryInput
from app.tasks.application.dto.create_task_category_output import CreatedTaskCategory
from app.tasks.domain import InvalidTaskCategoryPayloadError
from app.tasks.presentation.dependencies import set_dependency_override as set_tasks


@dataclass
class FakeCreateTaskCategoryUseCase:
    """Test double for the create-task-category use case."""

    result: CreatedTaskCategory | None = None
    error: Exception | None = None
    calls: list[CreateTaskCategoryInput] | None = None

    def __post_init__(self) -> None:
        if self.calls is None:
            self.calls = []

    def execute(self, input_dto: CreateTaskCategoryInput) -> CreatedTaskCategory:
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


def test_create_task_category_returns_401_when_authorization_header_is_missing(
    client,
) -> None:
    response = client.post(
        "/api/tasks/categories/",
        data=json.dumps({"name": "Backend"}),
        content_type="application/json",
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication credentials were not provided."}


def test_create_task_category_returns_401_for_invalid_access_token(client) -> None:
    set_auth("access_token_decoder", FakeAccessTokenDecoder(error=ValueError("bad token")))
    set_auth("user_repository", FakeUserRepository(user=None))

    response = client.post(
        "/api/tasks/categories/",
        data=json.dumps({"name": "Backend"}),
        content_type="application/json",
        headers={"Authorization": "Bearer invalid-access-token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "invalid access token"}


def test_create_task_category_uses_request_user_id_from_authenticated_token(
    client,
) -> None:
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
    fake_use_case = FakeCreateTaskCategoryUseCase(
        result=CreatedTaskCategory(
            id="cat-1",
            name="Backend",
            color="#0055AA",
            created_at="2026-03-04T10:30:00+00:00",
            updated_at="2026-03-04T10:30:00+00:00",
        )
    )
    set_tasks("create_task_category_use_case", fake_use_case)

    response = client.post(
        "/api/tasks/categories/",
        data=json.dumps({"name": "Backend", "color": "#0055AA"}),
        content_type="application/json",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 201
    assert response.json() == {
        "id": "cat-1",
        "name": "Backend",
        "color": "#0055AA",
        "created_at": "2026-03-04T10:30:00+00:00",
        "updated_at": "2026-03-04T10:30:00+00:00",
    }
    assert fake_use_case.calls is not None
    assert fake_use_case.calls == [
        CreateTaskCategoryInput(
            user_id="user-123",
            name="Backend",
            color="#0055AA",
        )
    ]


def test_create_task_category_returns_400_for_domain_validation_error(client) -> None:
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
        "create_task_category_use_case",
        FakeCreateTaskCategoryUseCase(
            error=InvalidTaskCategoryPayloadError(
                [
                    ValidationIssue(
                        field="name",
                        message="category name already exists for the authenticated user",
                    )
                ]
            )
        ),
    )

    response = client.post(
        "/api/tasks/categories/",
        data=json.dumps({"name": "Backend"}),
        content_type="application/json",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 400
    assert response.json() == {
        "detail": [
            {
                "field": "name",
                "message": "category name already exists for the authenticated user",
            }
        ]
    }


def test_create_task_category_returns_422_for_request_validation_error(client) -> None:
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
    fake_use_case = FakeCreateTaskCategoryUseCase(
        result=CreatedTaskCategory(
            id="cat-1",
            name="Backend",
            color=None,
            created_at="2026-03-04T10:30:00+00:00",
            updated_at="2026-03-04T10:30:00+00:00",
        )
    )
    set_tasks("create_task_category_use_case", fake_use_case)

    response = client.post(
        "/api/tasks/categories/",
        data=json.dumps({"name": ""}),
        content_type="application/json",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "name"]
    assert fake_use_case.calls == []
