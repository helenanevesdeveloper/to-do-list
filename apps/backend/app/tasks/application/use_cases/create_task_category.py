from dataclasses import dataclass

from app.tasks.application.dto.create_task_category_input import CreateTaskCategoryInput
from app.tasks.application.dto.create_task_category_output import CreatedTaskCategory
from app.tasks.infrastructure.repositories.task_category_command_repository import (
    TaskCategoryCommandRepository,
)


@dataclass(slots=True)
class CreateTaskCategoryUseCase:
    task_category_command_repository: TaskCategoryCommandRepository

    def execute(self, input_dto: CreateTaskCategoryInput) -> CreatedTaskCategory:
        return self.task_category_command_repository.create_category(input_dto)
