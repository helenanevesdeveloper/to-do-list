# pylint: disable=abstract-method,missing-class-docstring,missing-function-docstring
"""Serializers for the tasks presentation layer."""

from typing import cast

from rest_framework import serializers

from app.tasks.infrastructure.orm.models import TaskSharePermission
from app.tasks.application.dto.create_task_category_input import CreateTaskCategoryInput
from app.tasks.application.dto.create_task_share_input import CreateTaskShareInput
from app.tasks.application.dto.create_tasks_input import (
    CreateTaskItemInput,
    CreateTasksInput,
)
from app.tasks.application.dto.delete_task_categories_input import (
    DeleteTaskCategoriesInput,
)
from app.tasks.application.dto.delete_tasks_input import DeleteTasksInput
from app.tasks.application.dto.list_tasks_input import ListTasksInput
from app.tasks.application.dto.update_task_category_input import (
    UpdateTaskCategoryInput,
)
from app.tasks.application.dto.update_task_input import UpdateTaskInput


class TaskListQuerySerializer(serializers.Serializer):
    page = serializers.IntegerField(required=False, default=1, min_value=1)
    page_size = serializers.IntegerField(
        required=False, default=20, min_value=1, max_value=100
    )
    is_completed = serializers.BooleanField(required=False)
    category_id = serializers.CharField(required=False)
    scope = serializers.ChoiceField(
        required=False, default="owned", choices=["owned", "shared", "all"]
    )

    def to_dto(self, *, user_id: str) -> ListTasksInput:
        data = cast(dict[str, object], self.validated_data)

        return ListTasksInput(
            user_id=user_id,
            page=cast(int, data["page"]),
            page_size=cast(int, data["page_size"]),
            is_completed=cast(bool | None, data.get("is_completed")),
            category_id=cast(str | None, data.get("category_id")),
            scope=cast(str, data["scope"]),
        )


class TaskCreateItemRequestSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
        default=None,
    )
    category_id = serializers.CharField(required=False, allow_null=True, default=None)
    is_completed = serializers.BooleanField(required=False, default=False)


class TaskCreateRequestSerializer(serializers.Serializer):
    items = TaskCreateItemRequestSerializer(many=True, allow_empty=False)

    def to_dto(self, *, user_id: str) -> CreateTasksInput:
        data = cast(dict[str, object], self.validated_data)
        raw_items = cast(list[dict[str, object]], data["items"])

        return CreateTasksInput(
            user_id=user_id,
            items=[
                CreateTaskItemInput(
                    title=cast(str, item["title"]),
                    description=self._normalize_optional_text(
                        cast(str | None, item.get("description"))
                    ),
                    category_id=cast(str | None, item.get("category_id")),
                    is_completed=cast(bool, item["is_completed"]),
                )
                for item in raw_items
            ],
        )

    def _normalize_optional_text(self, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        return value


class TaskCategoryCreateRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)
    color = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
        default=None,
        max_length=32,
    )

    def to_dto(self, *, user_id: str) -> CreateTaskCategoryInput:
        data = cast(dict[str, object], self.validated_data)
        return CreateTaskCategoryInput(
            user_id=user_id,
            name=cast(str, data["name"]),
            color=self._normalize_optional_text(cast(str | None, data.get("color"))),
        )

    def _normalize_optional_text(self, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        return value


class TaskShareCreateRequestSerializer(serializers.Serializer):
    shared_with_user_id = serializers.CharField()
    permission = serializers.ChoiceField(
        choices=TaskSharePermission.choices,
        default=TaskSharePermission.READER,
    )

    def to_dto(self, *, user_id: str, task_id: str) -> CreateTaskShareInput:
        data = cast(dict[str, object], self.validated_data)
        return CreateTaskShareInput(
            user_id=user_id,
            task_id=task_id,
            shared_with_user_id=cast(str, data["shared_with_user_id"]),
            permission=cast(str, data["permission"]),
        )


class TaskCategoryUpdateRequestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=120)

    def to_dto(self, *, user_id: str, category_id: str) -> UpdateTaskCategoryInput:
        data = cast(dict[str, object], self.validated_data)
        return UpdateTaskCategoryInput(
            user_id=user_id,
            category_id=category_id,
            name=cast(str, data["name"]),
        )


class TaskCategoryResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    color = serializers.CharField(allow_null=True)


class TaskCategoryItemResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    color = serializers.CharField(allow_null=True)
    created_at = serializers.CharField()
    updated_at = serializers.CharField()


class TaskCategoryListResponseSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    results = TaskCategoryItemResponseSerializer(many=True)


class TaskSharingSummarySerializer(serializers.Serializer):
    is_owner = serializers.BooleanField()
    permission = serializers.CharField(allow_null=True)
    is_shared = serializers.BooleanField()
    shared_count = serializers.IntegerField()


class TaskItemResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField(allow_null=True)
    is_completed = serializers.BooleanField()
    created_at = serializers.CharField()
    updated_at = serializers.CharField()
    category = TaskCategoryResponseSerializer(allow_null=True)
    sharing = TaskSharingSummarySerializer()


class TaskListResponseSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    next = serializers.CharField(allow_null=True)
    previous = serializers.CharField(allow_null=True)
    results = TaskItemResponseSerializer(many=True)


class TaskCreateResponseSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    results = TaskItemResponseSerializer(many=True)


class TaskUpdateRequestSerializer(serializers.Serializer):
    title = serializers.CharField(required=False, max_length=255)
    description = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    category_id = serializers.CharField(
        required=False,
        allow_null=True,
        allow_blank=True,
    )
    is_completed = serializers.BooleanField(required=False)

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                "at least one updatable field must be provided"
            )
        return attrs

    def to_dto(self, *, user_id: str, task_id: str) -> UpdateTaskInput:
        data = cast(dict[str, object], self.validated_data)
        return UpdateTaskInput(
            user_id=user_id,
            task_id=task_id,
            title=cast(str | None, data.get("title")),
            title_provided="title" in data,
            description=self._normalize_optional_text(
                cast(str | None, data.get("description"))
            ),
            description_provided="description" in data,
            category_id=self._normalize_optional_text(
                cast(str | None, data.get("category_id"))
            ),
            category_id_provided="category_id" in data,
            is_completed=cast(bool | None, data.get("is_completed")),
            is_completed_provided="is_completed" in data,
        )

    def _normalize_optional_text(self, value: str | None) -> str | None:
        if value is None or value == "":
            return None
        return value


class TaskDeleteRequestSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False,
    )

    def to_dto(self, *, user_id: str) -> DeleteTasksInput:
        data = cast(dict[str, object], self.validated_data)
        return DeleteTasksInput(
            user_id=user_id,
            ids=cast(list[str], data["ids"]),
        )


class TaskDeleteResponseSerializer(serializers.Serializer):
    requested = serializers.IntegerField()
    deleted = serializers.IntegerField()
    failed = serializers.IntegerField()


class TaskCategoryDeleteRequestSerializer(serializers.Serializer):
    ids = serializers.ListField(
        child=serializers.CharField(),
        allow_empty=False,
    )

    def to_dto(self, *, user_id: str) -> DeleteTaskCategoriesInput:
        data = cast(dict[str, object], self.validated_data)
        return DeleteTaskCategoriesInput(
            user_id=user_id,
            ids=cast(list[str], data["ids"]),
        )


class TaskCategoryDeleteResponseSerializer(serializers.Serializer):
    requested = serializers.IntegerField()
    deleted = serializers.IntegerField()
    failed = serializers.IntegerField()


class TaskShareResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    shared_with_user_id = serializers.CharField()
    permission = serializers.CharField()
    created_at = serializers.CharField()


class TaskShareListResponseSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    results = TaskShareResponseSerializer(many=True)


class TaskDetailResponseSerializer(TaskItemResponseSerializer):
    shares = TaskShareResponseSerializer(many=True)
