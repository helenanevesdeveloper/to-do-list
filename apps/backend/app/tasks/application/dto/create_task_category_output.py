from dataclasses import dataclass


@dataclass(slots=True)
class CreatedTaskCategory:
    id: str
    name: str
    color: str | None
    created_at: str
    updated_at: str
