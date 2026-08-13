from dataclasses import dataclass


@dataclass(slots=True)
class ListTaskCategoriesInput:
    user_id: str
