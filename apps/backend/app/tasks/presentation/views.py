from dataclasses import asdict
from urllib.parse import urlencode

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from typing import cast

from app.shared.http import AuthenticatedAPIView
from app.tasks.application.dto.list_task_categories_input import (
    ListTaskCategoriesInput,
)
from app.tasks.application.dto.list_task_shares_input import ListTaskSharesInput

from .dependencies import (
    get_create_task_category_use_case,
    get_create_task_share_use_case,
    get_create_tasks_use_case,
    get_delete_task_categories_use_case,
    get_delete_tasks_use_case,
    get_list_task_shares_use_case,
    get_list_task_categories_use_case,
    get_list_tasks_use_case,
    get_update_task_category_use_case,
    get_update_task_use_case,
)
from .serializers import (
    TaskCategoryCreateRequestSerializer,
    TaskCategoryDeleteRequestSerializer,
    TaskCategoryDeleteResponseSerializer,
    TaskCategoryItemResponseSerializer,
    TaskCategoryListResponseSerializer,
    TaskCategoryUpdateRequestSerializer,
    TaskShareCreateRequestSerializer,
    TaskShareResponseSerializer,
    TaskCreateRequestSerializer,
    TaskCreateResponseSerializer,
    TaskDeleteRequestSerializer,
    TaskDeleteResponseSerializer,
    TaskListQuerySerializer,
    TaskListResponseSerializer,
    TaskItemResponseSerializer,
    TaskShareListResponseSerializer,
    TaskUpdateRequestSerializer,
)


class TaskListView(AuthenticatedAPIView):

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

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_create_tasks_post",
        request=TaskCreateRequestSerializer,
        responses={201: TaskCreateResponseSerializer},
        description="Create tasks in batch",
    )
    def post(self, request):
        payload = cast(
            TaskCreateRequestSerializer, TaskCreateRequestSerializer(data=request.data)
        )
        payload.is_valid(raise_exception=True)

        use_case = get_create_tasks_use_case()
        result = use_case.execute(payload.to_dto(user_id=request.user.id))
        response_body = {
            "count": len(result.items),
            "results": [asdict(item) for item in result.items],
        }
        return Response(
            TaskCreateResponseSerializer(response_body).data,
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_delete_tasks_delete",
        request=TaskDeleteRequestSerializer,
        responses={200: TaskDeleteResponseSerializer},
        description="Delete tasks in batch",
    )
    def delete(self, request):
        payload = cast(
            TaskDeleteRequestSerializer, TaskDeleteRequestSerializer(data=request.data)
        )
        payload.is_valid(raise_exception=True)

        use_case = get_delete_tasks_use_case()
        result = use_case.execute(payload.to_dto(user_id=request.user.id))
        return Response(
            TaskDeleteResponseSerializer(
                {
                    "requested": result.requested,
                    "deleted": result.deleted,
                    "failed": result.failed,
                }
            ).data
        )

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


class TaskCategoryListView(AuthenticatedAPIView):

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_list_task_categories_get",
        responses={200: TaskCategoryListResponseSerializer},
        description="List task categories",
    )
    def get(self, request):
        use_case = get_list_task_categories_use_case()
        result = use_case.execute(ListTaskCategoriesInput(user_id=request.user.id))
        payload = {
            "count": len(result.items),
            "results": [asdict(item) for item in result.items],
        }
        return Response(TaskCategoryListResponseSerializer(payload).data)

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_create_task_category_post",
        request=TaskCategoryCreateRequestSerializer,
        responses={201: TaskCategoryItemResponseSerializer},
        description="Create a task category",
    )
    def post(self, request):
        payload = cast(
            TaskCategoryCreateRequestSerializer,
            TaskCategoryCreateRequestSerializer(data=request.data),
        )
        payload.is_valid(raise_exception=True)

        use_case = get_create_task_category_use_case()
        result = use_case.execute(payload.to_dto(user_id=request.user.id))
        return Response(
            TaskCategoryItemResponseSerializer(asdict(result)).data,
            status=status.HTTP_201_CREATED,
        )

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_delete_task_categories_delete",
        request=TaskCategoryDeleteRequestSerializer,
        responses={200: TaskCategoryDeleteResponseSerializer},
        description="Delete task categories in batch",
    )
    def delete(self, request):
        payload = cast(
            TaskCategoryDeleteRequestSerializer,
            TaskCategoryDeleteRequestSerializer(data=request.data),
        )
        payload.is_valid(raise_exception=True)

        use_case = get_delete_task_categories_use_case()
        result = use_case.execute(payload.to_dto(user_id=request.user.id))
        return Response(
            TaskCategoryDeleteResponseSerializer(
                {
                    "requested": result.requested,
                    "deleted": result.deleted,
                    "failed": result.failed,
                }
            ).data
        )


class TaskDetailView(AuthenticatedAPIView):

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_update_task_patch",
        request=TaskUpdateRequestSerializer,
        responses={200: TaskItemResponseSerializer},
        description="Update a task partially",
    )
    def patch(self, request, task_id: str):
        payload = cast(
            TaskUpdateRequestSerializer,
            TaskUpdateRequestSerializer(data=request.data),
        )
        payload.is_valid(raise_exception=True)

        use_case = get_update_task_use_case()
        result = use_case.execute(
            payload.to_dto(
                user_id=request.user.id,
                task_id=task_id,
            )
        )
        return Response(TaskItemResponseSerializer(asdict(result)).data)


class TaskCategoryDetailView(AuthenticatedAPIView):

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_update_task_category_patch",
        request=TaskCategoryUpdateRequestSerializer,
        responses={200: TaskCategoryItemResponseSerializer},
        description="Update a task category partially",
    )
    def patch(self, request, category_id: str):
        payload = cast(
            TaskCategoryUpdateRequestSerializer,
            TaskCategoryUpdateRequestSerializer(data=request.data),
        )
        payload.is_valid(raise_exception=True)

        use_case = get_update_task_category_use_case()
        result = use_case.execute(
            payload.to_dto(
                user_id=request.user.id,
                category_id=category_id,
            )
        )
        return Response(TaskCategoryItemResponseSerializer(asdict(result)).data)


class TaskShareListView(AuthenticatedAPIView):

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_list_task_shares_get",
        responses={200: TaskShareListResponseSerializer},
        description="List shares for a task",
    )
    def get(self, request, task_id: str):
        use_case = get_list_task_shares_use_case()
        result = use_case.execute(
            ListTaskSharesInput(
                user_id=request.user.id,
                task_id=task_id,
            )
        )
        return Response(
            TaskShareListResponseSerializer(
                {
                    "count": len(result.items),
                    "results": [asdict(item) for item in result.items],
                }
            ).data
        )

    @extend_schema(
        tags=["tasks"],
        operation_id="tasks_create_task_share_post",
        request=TaskShareCreateRequestSerializer,
        responses={201: TaskShareResponseSerializer},
        description="Share a task with another user",
    )
    def post(self, request, task_id: str):
        payload = cast(
            TaskShareCreateRequestSerializer,
            TaskShareCreateRequestSerializer(data=request.data),
        )
        payload.is_valid(raise_exception=True)

        use_case = get_create_task_share_use_case()
        result = use_case.execute(
            payload.to_dto(
                user_id=request.user.id,
                task_id=task_id,
            )
        )
        return Response(
            TaskShareResponseSerializer(asdict(result)).data,
            status=status.HTTP_201_CREATED,
        )
