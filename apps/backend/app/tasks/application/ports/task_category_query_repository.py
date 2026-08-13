from typing import Protocol

from app.tasks.application.dto.list_task_categories_input import (
    ListTaskCategoriesInput,
)
from app.tasks.application.dto.list_task_categories_output import ListedTaskCategories


class TaskCategoryQueryRepository(Protocol):
    def list_categories(
        self,
        input_dto: ListTaskCategoriesInput,
    ) -> ListedTaskCategories:
        raise NotImplementedError
