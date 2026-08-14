from dataclasses import dataclass

from app.tasks.application.dto.create_tasks_input import CreateTasksInput
from app.tasks.application.dto.create_tasks_output import CreatedTasks
from app.tasks.infrastructure.repositories.task_command_repository import (
    TaskCommandRepository,
)


@dataclass(slots=True)
class CreateTasksUseCase:
    task_command_repository: TaskCommandRepository

    def execute(self, input_dto: CreateTasksInput) -> CreatedTasks:
        return self.task_command_repository.create_tasks(input_dto)
