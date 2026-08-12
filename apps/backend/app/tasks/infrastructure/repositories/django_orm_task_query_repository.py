from dataclasses import dataclass
from datetime import datetime
from typing import Protocol, cast

from django.db.models import (
    BooleanField,
    Case,
    Count,
    Exists,
    OuterRef,
    Q,
    Subquery,
    Value,
    When,
)

from app.tasks.application.dto.list_tasks_input import ListTasksInput
from app.tasks.application.dto.list_tasks_output import (
    PaginatedTasks,
    TaskCategoryListItem,
    TaskListItem,
    TaskSharingSummary,
)
from app.tasks.application.ports.task_query_repository import TaskQueryRepository
from app.tasks.infrastructure.orm.models import (
    TaskModel,
    TaskShareModel,
    TaskCategoryModel,
)


class TaskListRow(Protocol):
    id: str
    title: str
    description: str | None
    is_completed: bool
    created_at: datetime
    updated_at: datetime
    category: TaskCategoryModel | None
    is_owner: bool
    is_shared: bool
    shared_count: int
    current_user_permission: str | None


@dataclass(slots=True)
class DjangoOrmTaskQueryRepository(TaskQueryRepository):
    def list_tasks(self, input_dto: ListTasksInput) -> PaginatedTasks:
        #  - “procure shares da task atual” - “apenas para o usuário autenticado”
        share_for_user = TaskShareModel.objects.filter(
            task_id=OuterRef("pk"),
            shared_with_user_id=input_dto.user_id,
        )

        #  - pegue a subconsulta share_for_user - selecione só a coluna permission - limite a 1 resultado - anexe esse valor como um campo anotado chamado current_user_permission
        queryset = TaskModel.objects.select_related("category").annotate(
            is_owner=Case(
                When(owner_user_id=input_dto.user_id, then=Value(True)),
                default=Value(False),
                output_field=BooleanField(),
            ),
            is_shared=Exists(share_for_user),
            shared_count=Count("shares", distinct=True),
            current_user_permission=Subquery(share_for_user.values("permission")[:1]),
        )

        total = queryset.count()
        offset = (input_dto.page - 1) * input_dto.page_size
        rows = queryset.order_by("-created_at")[offset : offset + input_dto.page_size]

        items = [self._to_list_item(cast(TaskListRow, row)) for row in rows]
        return PaginatedTasks(
            items=items,
            total=total,
            page=input_dto.page,
            page_size=input_dto.page_size,
        )

    def _to_list_item(self, row: TaskListRow) -> TaskListItem:
        category = None
        if row.category is not None:
            category = TaskCategoryListItem(
                id=row.category.id,
                name=row.category.name,
                color=row.category.color,
            )
        permission = None if row.is_owner else row.current_user_permission
        sharing = TaskSharingSummary(
            is_owner=row.is_owner,
            permission=permission,
            is_shared=bool(row.shared_count),
            shared_count=row.shared_count,
        )

        return TaskListItem(
            id=row.id,
            title=row.title,
            description=row.description,
            is_completed=row.is_completed,
            created_at=row.created_at.isoformat(),
            updated_at=row.updated_at.isoformat(),
            category=category,
            sharing=sharing,
        )
