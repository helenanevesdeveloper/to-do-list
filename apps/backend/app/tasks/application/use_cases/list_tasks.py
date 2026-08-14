from dataclasses import dataclass

from app.tasks.application.dto.list_tasks_input import ListTasksInput
from app.tasks.application.dto.list_tasks_output import PaginatedTasks
from app.tasks.infrastructure.repositories.task_query_repository import (
    TaskQueryRepository,
)


@dataclass(slots=True)
class ListTasksUseCase:
    task_query_repository: TaskQueryRepository

    def execute(
        self,
        input_dto: ListTasksInput,
    ) -> PaginatedTasks:
        return self.task_query_repository.list_tasks(input_dto)
