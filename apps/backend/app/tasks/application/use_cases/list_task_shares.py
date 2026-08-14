from dataclasses import dataclass

from app.tasks.application.dto.list_task_shares_input import ListTaskSharesInput
from app.tasks.application.dto.list_task_shares_output import ListedTaskShares
from app.tasks.application.ports.task_query_repository import TaskQueryRepository


@dataclass(slots=True)
class ListTaskSharesUseCase:
    task_query_repository: TaskQueryRepository

    def execute(self, input_dto: ListTaskSharesInput) -> ListedTaskShares:
        return self.task_query_repository.list_task_shares(input_dto)
