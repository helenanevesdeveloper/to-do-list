from dataclasses import dataclass

from app.tasks.application.dto.create_task_category_output import CreatedTaskCategory
from app.tasks.application.dto.update_task_category_input import (
    UpdateTaskCategoryInput,
)
from app.tasks.application.ports.task_category_command_repository import (
    TaskCategoryCommandRepository,
)


@dataclass(slots=True)
class UpdateTaskCategoryUseCase:
    task_category_command_repository: TaskCategoryCommandRepository

    def execute(self, input_dto: UpdateTaskCategoryInput) -> CreatedTaskCategory:
        return self.task_category_command_repository.update_category(input_dto)
