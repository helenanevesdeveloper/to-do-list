from dataclasses import dataclass

from app.tasks.application.dto.delete_task_categories_input import (
    DeleteTaskCategoriesInput,
)
from app.tasks.application.dto.delete_task_categories_output import (
    DeletedTaskCategories,
)
from app.tasks.application.ports.task_category_command_repository import (
    TaskCategoryCommandRepository,
)


@dataclass(slots=True)
class DeleteTaskCategoriesUseCase:
    task_category_command_repository: TaskCategoryCommandRepository

    def execute(self, input_dto: DeleteTaskCategoriesInput) -> DeletedTaskCategories:
        return self.task_category_command_repository.delete_categories(input_dto)
