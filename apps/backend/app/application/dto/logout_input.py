from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class LogoutInput:
    session_id: str
