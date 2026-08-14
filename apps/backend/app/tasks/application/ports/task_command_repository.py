from typing import Protocol

from app.tasks.application.dto.create_task_share_input import CreateTaskShareInput
from app.tasks.application.dto.create_task_share_output import CreatedTaskShare
from app.tasks.application.dto.create_tasks_input import CreateTasksInput
from app.tasks.application.dto.create_tasks_output import CreatedTasks
from app.tasks.application.dto.delete_task_share_input import DeleteTaskShareInput
from app.tasks.application.dto.delete_tasks_input import DeleteTasksInput
from app.tasks.application.dto.delete_tasks_output import DeletedTasks
from app.tasks.application.dto.list_tasks_output import TaskListItem
from app.tasks.application.dto.update_task_input import UpdateTaskInput


class TaskCommandRepository(Protocol):
    def create_tasks(self, input_dto: CreateTasksInput) -> CreatedTasks:
        raise NotImplementedError

    def create_task_share(self, input_dto: CreateTaskShareInput) -> CreatedTaskShare:
        raise NotImplementedError

    def delete_task_share(self, input_dto: DeleteTaskShareInput) -> None:
        raise NotImplementedError

    def delete_tasks(self, input_dto: DeleteTasksInput) -> DeletedTasks:
        raise NotImplementedError

    def update_task(self, input_dto: UpdateTaskInput) -> TaskListItem:
        raise NotImplementedError
