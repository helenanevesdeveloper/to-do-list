from dataclasses import dataclass


@dataclass(slots=True, frozen=True)
class AuthenticateUserOutput:
    access_token: str
    token_type: str
