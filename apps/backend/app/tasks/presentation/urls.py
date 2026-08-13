from django.urls import path

from .views import (
    TaskCategoryDetailView,
    TaskCategoryListView,
    TaskDetailView,
    TaskListView,
)

urlpatterns = [
    path("categories/", TaskCategoryListView.as_view(), name="create-task-category"),
    path(
        "categories/<str:category_id>/",
        TaskCategoryDetailView.as_view(),
        name="task-category-detail",
    ),
    path("<str:task_id>/", TaskDetailView.as_view(), name="task-detail"),
    path("", TaskListView.as_view(), name="list-tasks"),
]
