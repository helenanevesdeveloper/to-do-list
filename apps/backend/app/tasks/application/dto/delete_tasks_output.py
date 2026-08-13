from dataclasses import dataclass


@dataclass(slots=True)
class DeletedTasks:
    requested: int
    deleted: int
    failed: int
