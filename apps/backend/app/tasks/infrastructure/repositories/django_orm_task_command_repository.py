"""Django ORM write repository for the tasks feature."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Callable

from django.db import IntegrityError
from django.db import transaction

from app.auth.models import UserModel
from app.shared.exceptions import ValidationIssue
from app.shared.runtime import generate_uuid, utc_now
from app.tasks.application.dto.create_task_share_input import CreateTaskShareInput
from app.tasks.application.dto.create_task_share_output import CreatedTaskShare
from app.tasks.application.dto.create_tasks_input import (
    CreateTaskItemInput,
    CreateTasksInput,
)
from app.tasks.application.dto.create_tasks_output import CreatedTasks
from app.tasks.application.dto.delete_tasks_input import DeleteTasksInput
from app.tasks.application.dto.delete_tasks_output import DeletedTasks
from app.tasks.application.dto.list_tasks_output import (
    TaskCategoryListItem,
    TaskListItem,
    TaskSharingSummary,
)
from app.tasks.application.dto.update_task_input import UpdateTaskInput
from app.tasks.application.ports.task_command_repository import TaskCommandRepository
from app.tasks.domain import (
    InvalidTaskPayloadError,
    InvalidTaskSharePayloadError,
    TaskNotFoundError,
)
from app.tasks.models import TaskCategoryModel, TaskModel, TaskShareModel


@dataclass(slots=True)
class DjangoOrmTaskCommandRepository(TaskCommandRepository):
    """Persist task-creation requests and return the created collection view."""

    generate_task_id: Callable[[], str] = field(default=generate_uuid)
    generate_task_share_id: Callable[[], str] = field(default=generate_uuid)
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

    def delete_tasks(self, input_dto: DeleteTasksInput) -> DeletedTasks:
        deleted_count, _ = TaskModel.objects.filter(
            owner_user_id=input_dto.user_id,
            id__in=input_dto.ids,
        ).delete()
        requested_count = len(input_dto.ids)
        return DeletedTasks(
            requested=requested_count,
            deleted=deleted_count,
            failed=requested_count - deleted_count,
        )

    def create_task_share(self, input_dto: CreateTaskShareInput) -> CreatedTaskShare:
        task = TaskModel.objects.filter(
            id=input_dto.task_id,
            owner_user_id=input_dto.user_id,
        ).first()
        if task is None:
            raise TaskNotFoundError("task was not found")

        self._validate_task_share_payload(input_dto)

        share_id = self.generate_task_share_id()
        timestamp = self.get_now()

        try:
            with transaction.atomic():
                TaskShareModel.objects.create(
                    id=share_id,
                    task_id=input_dto.task_id,
                    shared_with_user_id=input_dto.shared_with_user_id,
                    permission=input_dto.permission,
                    created_at=timestamp,
                    updated_at=timestamp,
                )
        except IntegrityError as exc:
            raise InvalidTaskSharePayloadError(
                [
                    ValidationIssue(
                        field="shared_with_user_id",
                        message="task is already shared with the provided user",
                    )
                ]
            ) from exc

        return CreatedTaskShare(
            id=share_id,
            shared_with_user_id=input_dto.shared_with_user_id,
            permission=input_dto.permission,
            created_at=timestamp.isoformat(),
        )

    def update_task(self, input_dto: UpdateTaskInput) -> TaskListItem:
        with transaction.atomic():
            task = (
                TaskModel.objects.select_related("category")
                .filter(
                    id=input_dto.task_id,
                    owner_user_id=input_dto.user_id,
                )
                .first()
            )
            if task is None:
                raise TaskNotFoundError("task was not found")

            update_fields: list[str] = []

            if input_dto.title_provided:
                task.title = input_dto.title or ""
                update_fields.append("title")

            if input_dto.description_provided:
                task.description = input_dto.description
                update_fields.append("description")

            if input_dto.category_id_provided:
                category = self._load_update_category(input_dto)
                task.category = category
                update_fields.append("category")

            if input_dto.is_completed_provided:
                task.is_completed = bool(input_dto.is_completed)
                update_fields.append("is_completed")

            timestamp = self.get_now()
            task.updated_at = timestamp
            update_fields.append("updated_at")
            task.save(update_fields=update_fields)

        return self._to_task_list_item_from_model(task)

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

    def _load_update_category(
        self,
        input_dto: UpdateTaskInput,
    ) -> TaskCategoryModel | None:
        if input_dto.category_id is None:
            return None

        category = TaskCategoryModel.objects.filter(
            id=input_dto.category_id,
            owner_user_id=input_dto.user_id,
        ).first()
        if category is None:
            raise InvalidTaskPayloadError(
                [
                    ValidationIssue(
                        field="category_id",
                        message=(
                            "category does not exist or is not owned by the authenticated user"
                        ),
                    )
                ]
            )
        return category

    def _validate_task_share_payload(self, input_dto: CreateTaskShareInput) -> None:
        if input_dto.shared_with_user_id == input_dto.user_id:
            raise InvalidTaskSharePayloadError(
                [
                    ValidationIssue(
                        field="shared_with_user_id",
                        message="task owner cannot be added as a share recipient",
                    )
                ]
            )

        if not UserModel.objects.filter(id=input_dto.shared_with_user_id).exists():
            raise InvalidTaskSharePayloadError(
                [
                    ValidationIssue(
                        field="shared_with_user_id",
                        message="shared user does not exist",
                    )
                ]
            )

    def _to_task_list_item_from_model(self, task: TaskModel) -> TaskListItem:
        category_item = None
        if task.category is not None:
            category_item = TaskCategoryListItem(
                id=task.category.id,
                name=task.category.name,
                color=task.category.color,
            )

        return TaskListItem(
            id=task.id,
            title=task.title,
            description=task.description,
            is_completed=task.is_completed,
            created_at=task.created_at.isoformat(),
            updated_at=task.updated_at.isoformat(),
            category=category_item,
            sharing=TaskSharingSummary(
                is_owner=True,
                permission=None,
                is_shared=False,
                shared_count=0,
            ),
        )
