from dataclasses import dataclass

from app.tasks.application.dto.list_task_categories_input import (
    ListTaskCategoriesInput,
)
from app.tasks.application.dto.list_task_categories_output import ListedTaskCategories
from app.tasks.application.ports.task_category_query_repository import (
    TaskCategoryQueryRepository,
)


@dataclass(slots=True)
class ListTaskCategoriesUseCase:
    task_category_query_repository: TaskCategoryQueryRepository

    def execute(
        self,
        input_dto: ListTaskCategoriesInput,
    ) -> ListedTaskCategories:
        return self.task_category_query_repository.list_categories(input_dto)
