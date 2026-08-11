from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class ValidationIssue:
    field: str
    message: str


class DomainError(Exception):
    pass


class ValidationError(DomainError):
    @property
    def issues(self) -> list[ValidationIssue] | None:
        return None


class EmptyFieldError(ValidationError):
    pass


class InvalidEmailError(ValidationError):
    pass


class WeakPasswordError(ValidationError):
    def __init__(self, issues: list[ValidationIssue]) -> None:
        if not issues:
            raise ValueError("WeakPasswordError requires at least one issue")
        super().__init__(issues[0].message)
        self._issues = issues

    @property
    def issues(self) -> list[ValidationIssue] | None:
        return self._issues


class UserAlreadyExistsError(DomainError):
    pass


class InvalidCredentialsError(DomainError):
    pass


class InactiveUserError(DomainError):
    pass


class SessionNotFoundError(DomainError):
    pass


class SessionAlreadyRevokedError(DomainError):
    pass
