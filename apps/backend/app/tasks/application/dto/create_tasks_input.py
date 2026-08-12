from dataclasses import dataclass


@dataclass(slots=True)
class CreateTaskItemInput:
    title: str
    description: str | None = None
    category_id: str | None = None
    is_completed: bool = False


@dataclass(slots=True)
class CreateTasksInput:
    user_id: str
    items: list[CreateTaskItemInput]
