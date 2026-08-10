from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class RegisterUserOutput:
    id: str
    email: str
    created_at: str
    is_active: bool
