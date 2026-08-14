from dataclasses import dataclass


@dataclass(slots=True)
class ListTaskSharesInput:
    user_id: str
    task_id: str
