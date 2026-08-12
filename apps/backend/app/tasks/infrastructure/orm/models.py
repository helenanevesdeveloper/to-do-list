from django.db import models


class TaskCategoryModel(models.Model):
    id = models.TextField(primary_key=True)
    owner_user_id = models.TextField()
    name = models.CharField(max_length=120)
    color = models.CharField(max_length=32, null=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "task_categories"


class TaskModel(models.Model):
    id = models.TextField(primary_key=True)
    owner_user_id = models.TextField()
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
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "tasks"


class TaskShareModel(models.Model):
    id = models.TextField(primary_key=True)
    task = models.ForeignKey(
        TaskModel,
        on_delete=models.CASCADE,
        db_column="task_id",
        related_name="shares",
    )
    shared_with_user_id = models.TextField()
    permission = models.CharField(max_length=16)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = "task_shares"
