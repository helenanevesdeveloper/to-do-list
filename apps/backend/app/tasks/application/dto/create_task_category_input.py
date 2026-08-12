from dataclasses import dataclass


@dataclass(slots=True)
class CreateTaskCategoryInput:
    user_id: str
    name: str
    color: str | None = None
