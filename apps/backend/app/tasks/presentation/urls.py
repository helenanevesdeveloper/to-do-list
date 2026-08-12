from django.urls import path

from .views import TaskCategoryListView, TaskListView

urlpatterns = [
    path("categories/", TaskCategoryListView.as_view(), name="create-task-category"),
    path("", TaskListView.as_view(), name="list-tasks"),
]
