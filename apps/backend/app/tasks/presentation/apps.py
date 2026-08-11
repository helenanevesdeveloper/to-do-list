from django.apps import AppConfig


class TasksApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app.tasks.presentation"
    label = "tasks_api"
    verbose_name = "Tasks API"
