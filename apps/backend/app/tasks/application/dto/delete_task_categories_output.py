from dataclasses import dataclass


@dataclass(slots=True)
class DeletedTaskCategories:
    requested: int
    deleted: int
    failed: int
