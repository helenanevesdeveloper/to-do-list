from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class AuthenticateUserInput:
    email: str
    password: str
