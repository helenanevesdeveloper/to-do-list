from rest_framework import serializers


class TaskListQuerySerializer(serializers.Serializer):
    page = serializers.IntegerField(required=False, default=1, min_value=1)
    is_completed = serializers.BooleanField(required=False)
    category_id = serializers.CharField(required=False)


class TaskCategoryResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    color = serializers.CharField(allow_null=True)


class TaskItemResponseSerializer(serializers.Serializer):
    id = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    is_completed = serializers.BooleanField()
    created_at = serializers.CharField()
    updated_at = serializers.CharField()
    category = TaskCategoryResponseSerializer(allow_null=True)


class TaskListResponseSerializer(serializers.Serializer):
    count = serializers.IntegerField()
    next = serializers.CharField(allow_null=True)
    previous = serializers.CharField(allow_null=True)
    results = TaskItemResponseSerializer(many=True)
