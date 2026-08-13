from dataclasses import dataclass

from app.tasks.application.dto.delete_tasks_input import DeleteTasksInput
from app.tasks.application.dto.delete_tasks_output import DeletedTasks
from app.tasks.application.ports.task_command_repository import TaskCommandRepository


@dataclass(slots=True)
class DeleteTasksUseCase:
    task_command_repository: TaskCommandRepository

    def execute(self, input_dto: DeleteTasksInput) -> DeletedTasks:
        return self.task_command_repository.delete_tasks(input_dto)
