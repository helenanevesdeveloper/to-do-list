from dataclasses import dataclass


@dataclass(slots=True)
class CreateTaskShareInput:
    user_id: str
    task_id: str
    shared_with_user_id: str
    permission: str
