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
from app.tasks.application.ports.task_category_command_repository import (
    TaskCategoryCommandRepository,
)
from app.tasks.domain import InvalidTaskCategoryPayloadError
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

    def _ensure_category_name_is_available(
        self,
        input_dto: CreateTaskCategoryInput,
    ) -> None:
        if not TaskCategoryModel.objects.filter(
            owner_user_id=input_dto.user_id,
            name=input_dto.name,
        ).exists():
            return

        raise InvalidTaskCategoryPayloadError(
            [
                ValidationIssue(
                    field="name",
                    message="category name already exists for the authenticated user",
                )
            ]
        )
