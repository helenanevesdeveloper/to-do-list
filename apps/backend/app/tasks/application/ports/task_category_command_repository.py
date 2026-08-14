from typing import Protocol

from app.tasks.application.dto.create_task_category_input import CreateTaskCategoryInput
from app.tasks.application.dto.create_task_category_output import CreatedTaskCategory
from app.tasks.application.dto.delete_task_categories_input import (
    DeleteTaskCategoriesInput,
)
from app.tasks.application.dto.update_task_category_input import (
    UpdateTaskCategoryInput,
)


class TaskCategoryCommandRepository(Protocol):
    def create_category(
        self, input_dto: CreateTaskCategoryInput
    ) -> CreatedTaskCategory:
        raise NotImplementedError

    def delete_category(
        self, input_dto: DeleteTaskCategoriesInput
    ) -> None:
        raise NotImplementedError

    def update_category(
        self, input_dto: UpdateTaskCategoryInput
    ) -> CreatedTaskCategory:
        raise NotImplementedError
