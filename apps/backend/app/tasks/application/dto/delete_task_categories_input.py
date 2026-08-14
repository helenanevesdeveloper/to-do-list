from dataclasses import dataclass


@dataclass(slots=True)
class DeleteTaskCategoriesInput:
    user_id: str
    category_id: str
