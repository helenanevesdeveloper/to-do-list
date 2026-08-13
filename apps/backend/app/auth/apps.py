"""Django app configuration for the authentication feature."""

from django.apps import AppConfig


class AuthConfig(AppConfig):
    """Register the authentication feature as a root Django app."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "app.auth"
    label = "auth_app"
    verbose_name = "Authentication"

    def ready(self) -> None:
        import app.auth.presentation.openapi  # noqa: F401
