from django.apps import AppConfig


class AuthApiConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app.auth.presentation"
    label = "auth_api"
    verbose_name = "Authentication API"

    def ready(self) -> None:
        import app.auth.presentation.openapi  # noqa: F401
