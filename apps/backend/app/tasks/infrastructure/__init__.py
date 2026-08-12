"""Infrastructure layer for the tasks feature."""

from .repositories.django_orm_task_query_repository import DjangoOrmTaskQueryRepository

__all__ = ["DjangoOrmTaskQueryRepository"]
