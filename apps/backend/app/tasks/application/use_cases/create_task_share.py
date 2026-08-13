from dataclasses import dataclass

from app.tasks.application.dto.create_task_share_input import CreateTaskShareInput
from app.tasks.application.dto.create_task_share_output import CreatedTaskShare
from app.tasks.application.ports.task_command_repository import TaskCommandRepository


@dataclass(slots=True)
class CreateTaskShareUseCase:
    task_command_repository: TaskCommandRepository

    def execute(self, input_dto: CreateTaskShareInput) -> CreatedTaskShare:
        return self.task_command_repository.create_task_share(input_dto)
