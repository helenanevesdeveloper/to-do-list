from drf_spectacular.utils import extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import TaskListQuerySerializer, TaskListResponseSerializer


class TaskListView(APIView):
    @extend_schema(
        tags=["tasks"],
        parameters=[TaskListQuerySerializer],
        operation_id="tasks_list_tasks_get",
        responses={200: TaskListResponseSerializer},
        description="List tasks",
    )
    def get(self, request):
        serializer = TaskListQuerySerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)
