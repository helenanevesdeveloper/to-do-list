from typing import Protocol

from app.tasks.application.dto.list_task_shares_input import ListTaskSharesInput
from app.tasks.application.dto.list_task_shares_output import ListedTaskShares
from app.tasks.application.dto.list_tasks_input import ListTasksInput
from app.tasks.application.dto.list_tasks_output import PaginatedTasks


class TaskQueryRepository(Protocol):
    def list_tasks(self, input_dto: ListTasksInput) -> PaginatedTasks:
        raise NotImplementedError

    def list_task_shares(self, input_dto: ListTaskSharesInput) -> ListedTaskShares:
        raise NotImplementedError
