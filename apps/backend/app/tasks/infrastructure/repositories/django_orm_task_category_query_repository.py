"""Django ORM read repository for task-category queries."""

from dataclasses import dataclass

from app.tasks.application.dto.list_task_categories_input import (
    ListTaskCategoriesInput,
)
from app.tasks.application.dto.list_task_categories_output import (
    ListedTaskCategories,
    TaskCategoryItem,
)
from app.tasks.application.ports.task_category_query_repository import (
    TaskCategoryQueryRepository,
)
from app.tasks.models import TaskCategoryModel


@dataclass(slots=True)
class DjangoOrmTaskCategoryQueryRepository(TaskCategoryQueryRepository):
    """List task categories owned by the authenticated user."""

    def list_categories(
        self,
        input_dto: ListTaskCategoriesInput,
    ) -> ListedTaskCategories:
        rows = TaskCategoryModel.objects.filter(owner_user_id=input_dto.user_id).order_by(
            "name",
            "created_at",
            "id",
        )
        return ListedTaskCategories(
            items=[
                TaskCategoryItem(
                    id=row.id,
                    name=row.name,
                    color=row.color,
                    created_at=row.created_at.isoformat(),
                    updated_at=row.updated_at.isoformat(),
                )
                for row in rows
            ]
        )
