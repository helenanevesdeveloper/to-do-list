from typing import Protocol

from app.tasks.application.dto.create_tasks_input import CreateTasksInput
from app.tasks.application.dto.create_tasks_output import CreatedTasks


class TaskCommandRepository(Protocol):
    def create_tasks(self, input_dto: CreateTasksInput) -> CreatedTasks:
        raise NotImplementedError
