"""Django app configuration for the tasks feature."""

from django.apps import AppConfig


class TasksConfig(AppConfig):
    """Register the tasks feature as a root Django app."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "app.tasks"
    label = "tasks"
    verbose_name = "Tasks"
