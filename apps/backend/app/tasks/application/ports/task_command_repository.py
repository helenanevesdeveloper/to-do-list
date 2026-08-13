from typing import Protocol

from app.tasks.application.dto.create_tasks_input import CreateTasksInput
from app.tasks.application.dto.create_tasks_output import CreatedTasks
from app.tasks.application.dto.delete_tasks_input import DeleteTasksInput
from app.tasks.application.dto.delete_tasks_output import DeletedTasks
from app.tasks.application.dto.list_tasks_output import TaskListItem
from app.tasks.application.dto.update_task_input import UpdateTaskInput


class TaskCommandRepository(Protocol):
    def create_tasks(self, input_dto: CreateTasksInput) -> CreatedTasks:
        raise NotImplementedError

    def delete_tasks(self, input_dto: DeleteTasksInput) -> DeletedTasks:
        raise NotImplementedError

    def update_task(self, input_dto: UpdateTaskInput) -> TaskListItem:
        raise NotImplementedError
