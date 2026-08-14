"""Django ORM write repository for task-category commands."""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Callable

from django.db import IntegrityError
from django.db import transaction

from app.shared.exceptions import ValidationIssue
from app.shared.runtime import generate_uuid, utc_now
from app.tasks.application.dto.create_task_category_input import CreateTaskCategoryInput
from app.tasks.application.dto.create_task_category_output import CreatedTaskCategory
from app.tasks.application.dto.delete_task_categories_input import (
    DeleteTaskCategoriesInput,
)
from app.tasks.application.dto.delete_task_categories_output import (
    DeletedTaskCategories,
)
from app.tasks.application.dto.update_task_category_input import (
    UpdateTaskCategoryInput,
)
from app.tasks.application.ports.task_category_command_repository import (
    TaskCategoryCommandRepository,
)
from app.tasks.domain import (
    InvalidTaskCategoryPayloadError,
    TaskCategoryNotFoundError,
)
from app.tasks.models import TaskCategoryModel


@dataclass(slots=True)
class DjangoOrmTaskCategoryCommandRepository(TaskCategoryCommandRepository):
    """Persist task-category commands for the tasks feature."""

    generate_category_id: Callable[[], str] = field(default=generate_uuid)
    get_now: Callable[[], datetime] = field(default=utc_now)

    def create_category(
        self,
        input_dto: CreateTaskCategoryInput,
    ) -> CreatedTaskCategory:
        self._ensure_category_name_is_available(input_dto)

        category_id = self.generate_category_id()
        timestamp = self.get_now()

        try:
            with transaction.atomic():
                TaskCategoryModel.objects.create(
                    id=category_id,
                    owner_user_id=input_dto.user_id,
                    name=input_dto.name,
                    color=input_dto.color,
                    created_at=timestamp,
                    updated_at=timestamp,
                )
        except IntegrityError as exc:
            raise InvalidTaskCategoryPayloadError(
                [
                    ValidationIssue(
                        field="name",
                        message="category name already exists for the authenticated user",
                        code="task_category_name_already_exists",
                    )
                ]
            ) from exc

        return CreatedTaskCategory(
            id=category_id,
            name=input_dto.name,
            color=input_dto.color,
            created_at=timestamp.isoformat(),
            updated_at=timestamp.isoformat(),
        )

    def delete_categories(
        self,
        input_dto: DeleteTaskCategoriesInput,
    ) -> DeletedTaskCategories:
        deleted_count, _ = TaskCategoryModel.objects.filter(
            owner_user_id=input_dto.user_id,
            id__in=input_dto.ids,
        ).delete()
        requested_count = len(input_dto.ids)
        return DeletedTaskCategories(
            requested=requested_count,
            deleted=deleted_count,
            failed=requested_count - deleted_count,
        )

    def update_category(
        self,
        input_dto: UpdateTaskCategoryInput,
    ) -> CreatedTaskCategory:
        with transaction.atomic():
            category = (
                TaskCategoryModel.objects.filter(
                    id=input_dto.category_id,
                    owner_user_id=input_dto.user_id,
                )
                .first()
            )
            if category is None:
                raise TaskCategoryNotFoundError("task category was not found")

            self._ensure_category_name_is_available(
                CreateTaskCategoryInput(
                    user_id=input_dto.user_id,
                    name=input_dto.name,
                    color=category.color,
                ),
                exclude_category_id=category.id,
            )

            category.name = input_dto.name
            category.updated_at = self.get_now()

            try:
                category.save(update_fields=["name", "updated_at"])
            except IntegrityError as exc:
                raise InvalidTaskCategoryPayloadError(
                    [
                        ValidationIssue(
                            field="name",
                            message=(
                                "category name already exists for the authenticated user"
                            ),
                            code="task_category_name_already_exists",
                        )
                    ]
                ) from exc

        return CreatedTaskCategory(
            id=category.id,
            name=category.name,
            color=category.color,
            created_at=category.created_at.isoformat(),
            updated_at=category.updated_at.isoformat(),
        )

    def _ensure_category_name_is_available(
        self,
        input_dto: CreateTaskCategoryInput,
        *,
        exclude_category_id: str | None = None,
    ) -> None:
        queryset = TaskCategoryModel.objects.filter(
            owner_user_id=input_dto.user_id,
            name=input_dto.name,
        )
        if exclude_category_id is not None:
            queryset = queryset.exclude(id=exclude_category_id)

        if not queryset.exists():
            return

        raise InvalidTaskCategoryPayloadError(
            [
                ValidationIssue(
                    field="name",
                    message="category name already exists for the authenticated user",
                    code="task_category_name_already_exists",
                )
            ]
        )
