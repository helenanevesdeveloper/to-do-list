from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class RegisterUserInput:
    email: str
    password: str
