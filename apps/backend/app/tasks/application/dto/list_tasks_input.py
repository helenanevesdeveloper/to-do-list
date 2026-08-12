from dataclasses import dataclass


@dataclass(slots=True)
class ListTasksInput:
    user_id: str
    page: int = 1
    page_size: int = 20
    is_completed: bool | None = None
    category_id: str | None = None
    scope: str = "owned"
