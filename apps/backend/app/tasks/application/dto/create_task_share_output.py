from dataclasses import dataclass


@dataclass(slots=True)
class CreatedTaskShare:
    id: str
    shared_with_user_id: str
    permission: str
    created_at: str
