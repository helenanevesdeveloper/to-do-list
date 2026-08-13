from app.shared.exceptions import DomainError, ValidationError, ValidationIssue


class InvalidTaskPayloadError(ValidationError):
    def __init__(self, issues: list[ValidationIssue]) -> None:
        if not issues:
            raise ValueError("InvalidTaskPayloadError requires at least one issue")
        super().__init__(issues[0].message)
        self._issues = issues

    @property
    def issues(self) -> list[ValidationIssue] | None:
        return self._issues


class InvalidTaskCategoryPayloadError(ValidationError):
    def __init__(self, issues: list[ValidationIssue]) -> None:
        if not issues:
            raise ValueError(
                "InvalidTaskCategoryPayloadError requires at least one issue"
            )
        super().__init__(issues[0].message)
        self._issues = issues

    @property
    def issues(self) -> list[ValidationIssue] | None:
        return self._issues


class InvalidTaskSharePayloadError(ValidationError):
    def __init__(self, issues: list[ValidationIssue]) -> None:
        if not issues:
            raise ValueError("InvalidTaskSharePayloadError requires at least one issue")
        super().__init__(issues[0].message)
        self._issues = issues

    @property
    def issues(self) -> list[ValidationIssue] | None:
        return self._issues


class TaskCategoryNotFoundError(DomainError):
    pass


class TaskNotFoundError(DomainError):
    pass
