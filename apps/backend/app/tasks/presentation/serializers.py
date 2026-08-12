from rest_framework import serializers


class TaskListQuerySerializer(serializers.Serializer):
    page = serializers.IntegerField(required=False, default=1, min_value=1)
    is_completed = serializers.BooleanField(required=False)
    category_id = serializers.CharField(required=False)
    scope = serializers.ChoiceField(
        required=False, default="owned", choices=["owned", "shared", "all"]
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
    shares = TaskShareResponseSerializer
