from app.shared.exceptions import ValidationError, ValidationIssue


class InvalidTaskPayloadError(ValidationError):
    def __init__(self, issues: list[ValidationIssue]) -> None:
        if not issues:
            raise ValueError("InvalidTaskPayloadError requires at least one issue")
        super().__init__(issues[0].message)
        self._issues = issues

    @property
    def issues(self) -> list[ValidationIssue] | None:
        return self._issues
