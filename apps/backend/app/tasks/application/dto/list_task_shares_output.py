from dataclasses import dataclass

from app.tasks.application.dto.create_task_share_output import CreatedTaskShare


@dataclass(slots=True)
class ListedTaskShares:
    items: list[CreatedTaskShare]
