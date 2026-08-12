from dataclasses import dataclass

from app.tasks.application.dto.list_tasks_output import TaskListItem


@dataclass(slots=True)
class CreatedTasks:
    items: list[TaskListItem]
