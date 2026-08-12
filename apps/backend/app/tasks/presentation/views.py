from dataclasses import asdict
from urllib.parse import urlencode

from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from typing import cast

from app.auth.presentation.drf_authentication import JwtAuthentication

from .dependencies import get_list_tasks_use_case
from .serializers import TaskListQuerySerializer, TaskListResponseSerializer


class TaskListView(APIView):
    authentication_classes = [JwtAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["tasks"],
        parameters=[TaskListQuerySerializer],
        operation_id="tasks_list_tasks_get",
        responses={200: TaskListResponseSerializer},
        description="List tasks",
    )
    def get(self, request):
        query = cast(
            TaskListQuerySerializer, TaskListQuerySerializer(data=request.query_params)
        )
        query.is_valid(raise_exception=True)

        use_case = get_list_tasks_use_case()
        result = use_case.execute(query.to_dto(user_id=request.user.id))
        payload = {
            "count": result.total,
            "next": self._build_next_url(request, result),
            "previous": self._build_previous_url(request, result),
            "results": [asdict(item) for item in result.items],
        }
        return Response(TaskListResponseSerializer(payload).data)

    def _build_next_url(self, request, result) -> str | None:
        """Build the next-page URL in the API response.

        The backend returns navigable pagination links so clients do not need to
        reconstruct query strings or know pagination rules beyond following the
        contract exposed by the endpoint.
        """

        if result.page * result.page_size >= result.total:
            return None

        params = request.query_params.copy()
        params["page"] = result.page + 1
        return f"{request.build_absolute_uri(request.path)}?{urlencode(params, doseq=True)}"

    def _build_previous_url(self, request, result) -> str | None:
        """Build the previous-page URL in the API response.

        The backend returns navigable pagination links so clients do not need to
        reconstruct query strings or know pagination rules beyond following the
        contract exposed by the endpoint.
        """

        if result.page <= 1:
            return None

        params = request.query_params.copy()
        params["page"] = result.page - 1
        return f"{request.build_absolute_uri(request.path)}?{urlencode(params, doseq=True)}"
