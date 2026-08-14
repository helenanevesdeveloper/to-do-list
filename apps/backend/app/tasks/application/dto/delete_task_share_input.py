from dataclasses import dataclass


@dataclass(slots=True)
class DeleteTaskShareInput:
    user_id: str
    task_id: str
    share_id: str
