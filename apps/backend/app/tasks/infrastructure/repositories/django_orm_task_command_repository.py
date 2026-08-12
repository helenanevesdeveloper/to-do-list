"""Django ORM write repository for the tasks feature."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Callable

from django.db import transaction

from app.shared.exceptions import ValidationIssue
from app.shared.runtime import generate_uuid, utc_now
from app.tasks.application.dto.create_tasks_input import (
    CreateTaskItemInput,
    CreateTasksInput,
)
from app.tasks.application.dto.create_tasks_output import CreatedTasks
from app.tasks.application.dto.list_tasks_output import (
    TaskCategoryListItem,
    TaskListItem,
    TaskSharingSummary,
)
from app.tasks.application.ports.task_command_repository import TaskCommandRepository
from app.tasks.domain import InvalidTaskPayloadError
from app.tasks.models import TaskCategoryModel, TaskModel


@dataclass(slots=True)
class DjangoOrmTaskCommandRepository(TaskCommandRepository):
    """Persist task-creation requests and return the created collection view."""

    generate_task_id: Callable[[], str] = field(default=generate_uuid)
    get_now: Callable[[], datetime] = field(default=utc_now)

    def create_tasks(self, input_dto: CreateTasksInput) -> CreatedTasks:
        categories = self._load_categories(input_dto)
        created_items: list[TaskListItem] = []
        records: list[TaskModel] = []

        with transaction.atomic():
            for item in input_dto.items:
                task_id = self.generate_task_id()
                timestamp = self.get_now()
                category = (
                    categories[item.category_id]
                    if item.category_id is not None
                    else None
                )
                records.append(
                    TaskModel(
                        id=task_id,
                        owner_user_id=input_dto.user_id,
                        category_id=item.category_id,
                        title=item.title,
                        description=item.description,
                        is_completed=item.is_completed,
                        created_at=timestamp,
                        updated_at=timestamp,
                    )
                )
                created_items.append(
                    self._to_task_list_item(
                        task_id=task_id,
                        item=item,
                        created_at=timestamp,
                        updated_at=timestamp,
                        category=category,
                    )
                )

            TaskModel.objects.bulk_create(records)

        return CreatedTasks(items=created_items)

    def _load_categories(
        self,
        input_dto: CreateTasksInput,
    ) -> dict[str, TaskCategoryModel]:
        category_ids = sorted(
            {
                item.category_id
                for item in input_dto.items
                if item.category_id is not None
            }
        )
        if not category_ids:
            return {}

        categories = {
            category.id: category
            for category in TaskCategoryModel.objects.filter(
                id__in=category_ids,
                owner_user_id=input_dto.user_id,
            )
        }
        issues = [
            ValidationIssue(
                field=f"items.{index}.category_id",
                message=(
                    "category does not exist or is not owned by the authenticated user"
                ),
            )
            for index, item in enumerate(input_dto.items)
            if item.category_id is not None and item.category_id not in categories
        ]
        if issues:
            raise InvalidTaskPayloadError(issues)

        return categories

    def _to_task_list_item(
        self,
        *,
        task_id: str,
        item: CreateTaskItemInput,
        created_at: datetime,
        updated_at: datetime,
        category: TaskCategoryModel | None,
    ) -> TaskListItem:
        category_item = None
        if category is not None:
            category_item = TaskCategoryListItem(
                id=category.id,
                name=category.name,
                color=category.color,
            )

        return TaskListItem(
            id=task_id,
            title=item.title,
            description=item.description,
            is_completed=item.is_completed,
            created_at=created_at.isoformat(),
            updated_at=updated_at.isoformat(),
            category=category_item,
            sharing=TaskSharingSummary(
                is_owner=True,
                permission=None,
                is_shared=False,
                shared_count=0,
            ),
        )
