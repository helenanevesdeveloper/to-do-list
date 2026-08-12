from dataclasses import dataclass


@dataclass(slots=True)
class TaskCategoryListItem:
    id: str
    name: str
    color: str | None


@dataclass(slots=True)
class TaskSharingSummary:
    is_owner: bool
    permission: str | None
    is_shared: bool
    shared_count: int


@dataclass(slots=True)
class TaskListItem:
    id: str
    title: str
    description: str | None
    is_completed: bool
    created_at: str
    updated_at: str
    category: TaskCategoryListItem | None
    sharing: TaskSharingSummary


@dataclass(slots=True)
class PaginatedTasks:
    items: list[TaskListItem]
    total: int
    page: int
    page_size: int
