from dataclasses import dataclass

from app.tasks.application.dto.list_tasks_output import TaskListItem
from app.tasks.application.dto.update_task_input import UpdateTaskInput
from app.tasks.infrastructure.repositories.task_command_repository import (
    TaskCommandRepository,
)


@dataclass(slots=True)
class UpdateTaskUseCase:
    task_command_repository: TaskCommandRepository

    def execute(self, input_dto: UpdateTaskInput) -> TaskListItem:
        return self.task_command_repository.update_task(input_dto)
