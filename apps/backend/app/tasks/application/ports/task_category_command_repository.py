from typing import Protocol

from app.tasks.application.dto.create_task_category_input import CreateTaskCategoryInput
from app.tasks.application.dto.create_task_category_output import CreatedTaskCategory


class TaskCategoryCommandRepository(Protocol):
    def create_category(
        self, input_dto: CreateTaskCategoryInput
    ) -> CreatedTaskCategory:
        raise NotImplementedError
