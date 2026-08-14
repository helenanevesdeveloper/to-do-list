from dataclasses import dataclass

from app.tasks.application.dto.delete_task_share_input import DeleteTaskShareInput
from app.tasks.application.ports.task_command_repository import TaskCommandRepository


@dataclass(slots=True)
class DeleteTaskShareUseCase:
    task_command_repository: TaskCommandRepository

    def execute(self, input_dto: DeleteTaskShareInput) -> None:
        self.task_command_repository.delete_task_share(input_dto)
