from dataclasses import dataclass


@dataclass(slots=True)
class TaskCategoryItem:
    id: str
    name: str
    color: str | None
    created_at: str
    updated_at: str


@dataclass(slots=True)
class ListedTaskCategories:
    items: list[TaskCategoryItem]
