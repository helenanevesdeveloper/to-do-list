from django.db import models
from django.db.models import Q
from django.utils import timezone

from app.auth.infrastructure.orm.models import UserModel


class TaskSharePermission(models.TextChoices):
    READER = "reader", "Leitor"


class TaskCategoryModel(models.Model):
    id = models.TextField(primary_key=True)
    owner_user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        db_column="owner_user_id",
        related_name="task_categories",
    )
    name = models.CharField(max_length=120)
    color = models.CharField(max_length=32, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "task_categories"
        constraints = [
            models.UniqueConstraint(
                fields=["owner_user", "name"],
                name="uq_task_categories_owner_name",
            )
        ]
        indexes = [
            models.Index(
                fields=["owner_user"],
                include=["id", "name", "color", "updated_at"],
                name="idx_task_cat_owner_user",
            )
        ]


class TaskModel(models.Model):
    id = models.TextField(primary_key=True)
    owner_user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        db_column="owner_user_id",
        related_name="owned_tasks",
    )
    category = models.ForeignKey(
        TaskCategoryModel,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        db_column="task_category_id",
        related_name="tasks",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(null=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "tasks"
        indexes = [
            models.Index(
                fields=["owner_user", "-created_at"],
                include=["id", "title", "is_completed", "category", "updated_at"],
                name="idx_tasks_owner_created",
            ),
            models.Index(
                fields=["owner_user", "is_completed", "-created_at"],
                include=["id", "title", "category", "updated_at"],
                name="idx_tasks_owner_done_created",
            ),
            models.Index(
                fields=["owner_user", "category", "-created_at"],
                include=["id", "title", "is_completed", "updated_at"],
                name="idx_tasks_owner_cat_created",
            ),
        ]


class TaskShareModel(models.Model):
    id = models.TextField(primary_key=True)
    task = models.ForeignKey(
        TaskModel,
        on_delete=models.CASCADE,
        db_column="task_id",
        related_name="shares",
    )
    shared_with_user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        db_column="shared_with_user_id",
        related_name="received_task_shares",
    )
    permission = models.CharField(
        max_length=16,
        choices=TaskSharePermission.choices,
    )
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "task_shares"
        constraints = [
            models.UniqueConstraint(
                fields=["task", "shared_with_user"],
                name="uq_task_shares_task_user",
            ),
            models.CheckConstraint(
                condition=Q(permission__in=[TaskSharePermission.READER]),
                name="chk_task_shares_permission",
            ),
        ]
        indexes = [
            models.Index(
                fields=["task"],
                include=["shared_with_user", "permission", "created_at"],
                name="idx_task_shares_task",
            ),
            models.Index(
                fields=["shared_with_user", "-created_at"],
                include=["task", "permission"],
                name="idx_shares_shared_user_created",
            ),
        ]
