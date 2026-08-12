# pylint: disable=abstract-method,missing-class-docstring,missing-function-docstring
"""Serializers for the tasks presentation layer."""

from typing import cast

from rest_framework import serializers

from app.tasks.application.dto.list_tasks_input import ListTasksInput


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


class TaskCategoryResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    color = serializers.CharField(allow_null=True)


class TaskSharingSummarySerializer(serializers.Serializer):
    is_owner = serializers.BooleanField()
    permission = serializers.CharField()
    is_shared = serializers.BooleanField()
    shared_count = serializers.IntegerField()


class TaskItemResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
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


class TaskShareResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    shared_with_user_id = serializers.CharField()
    permission = serializers.CharField()
    created_at = serializers.CharField()


class TaskDetailResponseSerializer(TaskItemResponseSerializer):
    shares = TaskShareResponseSerializer(many=True)
