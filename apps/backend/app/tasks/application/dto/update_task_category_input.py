from dataclasses import dataclass


@dataclass(slots=True)
class UpdateTaskCategoryInput:
    user_id: str
    category_id: str
    name: str
