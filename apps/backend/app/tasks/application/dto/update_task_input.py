from dataclasses import dataclass


@dataclass(slots=True)
class UpdateTaskInput:
    user_id: str
    task_id: str
    title: str | None = None
    title_provided: bool = False
    description: str | None = None
    description_provided: bool = False
    category_id: str | None = None
    category_id_provided: bool = False
    is_completed: bool | None = None
    is_completed_provided: bool = False
