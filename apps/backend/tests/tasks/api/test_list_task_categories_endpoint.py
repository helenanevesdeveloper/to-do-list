"""API tests for the task-category list endpoint."""

from dataclasses import dataclass
from datetime import UTC, datetime

from app.auth.domain.entities import User
from app.auth.domain.value_objects import Email
from app.auth.presentation.dependencies import set_dependency_override as set_auth
from app.tasks.application.dto.list_task_categories_input import (
    ListTaskCategoriesInput,
)
from app.tasks.application.dto.list_task_categories_output import (
    ListedTaskCategories,
    TaskCategoryItem,
)
from app.tasks.presentation.dependencies import set_dependency_override as set_tasks


@dataclass
class FakeListTaskCategoriesUseCase:
    """Test double for the list-task-categories use case."""

    result: ListedTaskCategories
    calls: list[ListTaskCategoriesInput] | None = None

    def __post_init__(self) -> None:
        if self.calls is None:
            self.calls = []

    def execute(self, input_dto: ListTaskCategoriesInput) -> ListedTaskCategories:
        assert self.calls is not None
        self.calls.append(input_dto)
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


def test_list_task_categories_returns_401_when_authorization_header_is_missing(
    client,
) -> None:
    response = client.get("/api/tasks/categories/")

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication credentials were not provided."}


def test_list_task_categories_returns_401_for_invalid_access_token(client) -> None:
    set_auth("access_token_decoder", FakeAccessTokenDecoder(error=ValueError("bad token")))
    set_auth("user_repository", FakeUserRepository(user=None))

    response = client.get(
        "/api/tasks/categories/",
        headers={"Authorization": "Bearer invalid-access-token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "invalid access token"}


def test_list_task_categories_uses_request_user_id_from_authenticated_token(
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
    fake_use_case = FakeListTaskCategoriesUseCase(
        result=ListedTaskCategories(
            items=[
                TaskCategoryItem(
                    id="cat-1",
                    name="Backend",
                    color="#0055AA",
                    created_at="2026-03-04T10:30:00+00:00",
                    updated_at="2026-03-04T11:00:00+00:00",
                ),
                TaskCategoryItem(
                    id="cat-2",
                    name="Operations",
                    color=None,
                    created_at="2026-03-05T09:00:00+00:00",
                    updated_at="2026-03-05T09:15:00+00:00",
                ),
            ]
        )
    )
    set_tasks("list_task_categories_use_case", fake_use_case)

    response = client.get(
        "/api/tasks/categories/",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "count": 2,
        "results": [
            {
                "id": "cat-1",
                "name": "Backend",
                "color": "#0055AA",
                "created_at": "2026-03-04T10:30:00+00:00",
                "updated_at": "2026-03-04T11:00:00+00:00",
            },
            {
                "id": "cat-2",
                "name": "Operations",
                "color": None,
                "created_at": "2026-03-05T09:00:00+00:00",
                "updated_at": "2026-03-05T09:15:00+00:00",
            },
        ],
    }
    assert fake_use_case.calls is not None
    assert fake_use_case.calls == [ListTaskCategoriesInput(user_id="user-123")]
