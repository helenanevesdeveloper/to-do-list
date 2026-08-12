"""API tests for the task-list endpoint."""

from dataclasses import dataclass
from datetime import UTC, datetime

from app.auth.domain.entities import User
from app.auth.domain.value_objects import Email
from app.auth.presentation.dependencies import set_dependency_override as set_auth
from app.tasks.application.dto.list_tasks_input import ListTasksInput
from app.tasks.application.dto.list_tasks_output import (
    PaginatedTasks,
    TaskCategoryListItem,
    TaskListItem,
    TaskSharingSummary,
)
from app.tasks.presentation.dependencies import set_dependency_override as set_tasks


@dataclass
class FakeListTasksUseCase:
    """Test double for the list-tasks use case."""

    result: PaginatedTasks
    calls: list[ListTasksInput] | None = None

    def __post_init__(self) -> None:
        """Initialize the call log lazily for each test instance."""

        if self.calls is None:
            self.calls = []

    def execute(self, input_dto: ListTasksInput) -> PaginatedTasks:
        """Record the received DTO and return the configured result."""

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
        """Return the configured user id or raise the configured error."""

        if self.error is not None:
            raise self.error
        return self.user_id

    def get_session_id(self, _token: str) -> str:
        """Return the configured session id or raise the configured error."""

        if self.error is not None:
            raise self.error
        return self.session_id


@dataclass
class FakeUserRepository:
    """Test double for looking up the authenticated user."""

    user: User | None

    def find_by_id(self, user_id: str) -> User | None:
        """Return the configured user when ids match."""

        return self.user if self.user and self.user.id == user_id else None

    def find_by_email(self, _email: Email) -> User | None:
        """This fake does not support email lookups for these tests."""

        return None

    def save(self, user: User) -> User:
        """Return the provided user unchanged."""

        return user


def test_list_tasks_returns_401_when_authorization_header_is_missing(client) -> None:
    """Reject the request when no bearer token is provided."""

    response = client.get("/api/tasks/?page=1&page_size=20&scope=all")

    assert response.status_code == 401
    assert response.json() == {"detail": "Authentication credentials were not provided."}


def test_list_tasks_returns_401_for_invalid_access_token(client) -> None:
    """Reject the request when the supplied access token is invalid."""

    set_auth("access_token_decoder", FakeAccessTokenDecoder(error=ValueError("bad token")))
    set_auth("user_repository", FakeUserRepository(user=None))

    response = client.get(
        "/api/tasks/?page=1&page_size=20&scope=all",
        headers={"Authorization": "Bearer invalid-access-token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "invalid access token"}


def test_list_tasks_uses_request_user_id_from_authenticated_token(client) -> None:
    """Pass the authenticated user id and query params into the use case."""

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
    fake_use_case = FakeListTasksUseCase(
        result=PaginatedTasks(
            items=[
                TaskListItem(
                    id="task-1",
                    title="Review auth integration",
                    description="Confirm DRF request.user wiring",
                    is_completed=False,
                    created_at="2026-03-04T10:30:00+00:00",
                    updated_at="2026-03-04T11:00:00+00:00",
                    category=TaskCategoryListItem(
                        id="cat-1",
                        name="Backend",
                        color="#0055AA",
                    ),
                    sharing=TaskSharingSummary(
                        is_owner=True,
                        permission="owner",
                        is_shared=False,
                        shared_count=0,
                    ),
                )
            ],
            total=1,
            page=1,
            page_size=20,
        )
    )
    set_tasks("list_tasks_use_case", fake_use_case)

    response = client.get(
        "/api/tasks/?page=1&page_size=20&scope=all",
        headers={"Authorization": "Bearer valid-access-token"},
    )

    assert response.status_code == 200
    assert response.json() == {
        "count": 1,
        "next": None,
        "previous": None,
        "results": [
            {
                "id": "task-1",
                "title": "Review auth integration",
                "description": "Confirm DRF request.user wiring",
                "is_completed": False,
                "created_at": "2026-03-04T10:30:00+00:00",
                "updated_at": "2026-03-04T11:00:00+00:00",
                "category": {
                    "id": "cat-1",
                    "name": "Backend",
                    "color": "#0055AA",
                },
                "sharing": {
                    "is_owner": True,
                    "permission": "owner",
                    "is_shared": False,
                    "shared_count": 0,
                },
            }
        ],
    }
    assert fake_use_case.calls is not None
    assert len(fake_use_case.calls) == 1
    assert fake_use_case.calls[0].user_id == "user-123"
    assert fake_use_case.calls[0].page == 1
    assert fake_use_case.calls[0].page_size == 20
    assert fake_use_case.calls[0].scope == "all"
