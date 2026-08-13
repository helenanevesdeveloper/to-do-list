from dataclasses import dataclass


@dataclass(slots=True)
class DeleteTasksInput:
    user_id: str
    ids: list[str]
