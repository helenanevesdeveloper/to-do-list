from django.urls import path

from .views import TaskCategoryListView, TaskDetailView, TaskListView

urlpatterns = [
    path("categories/", TaskCategoryListView.as_view(), name="create-task-category"),
    path("<str:task_id>/", TaskDetailView.as_view(), name="task-detail"),
    path("", TaskListView.as_view(), name="list-tasks"),
]
