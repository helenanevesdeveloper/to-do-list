"""Root URL configuration for the Django backend."""

from django.urls import include, path  # type: ignore[import-untyped]
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from drf_spectacular.utils import extend_schema
from rest_framework.response import Response  # type: ignore[import-untyped]
from rest_framework.views import APIView  # type: ignore[import-untyped]


class HealthcheckView(APIView):
    """Expose a minimal healthcheck endpoint for local/runtime probes."""

    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    @extend_schema(exclude=True)
    def get(self, _request):
        """Return a minimal success payload for health probes."""
        return Response({"status": "ok"})


class ApiRootView(APIView):
    """Expose the top-level API entrypoints for discovery."""

    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    @extend_schema(exclude=True)
    def get(self, request):
        """Return the main API sub-route URLs."""
        return Response(
            {
                "auth": request.build_absolute_uri("auth/"),
                "tasks": request.build_absolute_uri("tasks/"),
            }
        )


urlpatterns = [
    path("health/", HealthcheckView.as_view(), name="healthcheck"),
    path("openapi.json", SpectacularAPIView.as_view(), name="schema"),
    path(
        "swagger/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path("api/", ApiRootView.as_view(), name="api-root"),
    path("api/auth/", include("app.auth.presentation.urls")),
    path("api/tasks/", include("app.tasks.presentation.urls")),
]
