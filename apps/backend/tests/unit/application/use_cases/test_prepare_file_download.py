from datetime import UTC, datetime

import pytest

from app.application.dto.prepare_file_download_input import PrepareFileDownloadInput
from app.application.use_cases.prepare_file_download import PrepareFileDownloadUseCase
from app.domain.entities.uploaded_file import UploadedFile
from app.domain.exceptions import UploadedFileNotFoundError


class FakeUploadedFileRepository:
    def __init__(self, uploaded_files: list[UploadedFile]) -> None:
        self.uploaded_files = uploaded_files
        self.find_many_calls: list[dict[str, object]] = []

    def save(self, uploaded_file: UploadedFile) -> UploadedFile:
        self.uploaded_files.append(uploaded_file)
        return uploaded_file

    def exists_by_user_and_original_filename(
        self,
        *,
        user_id: str,
        original_filename: str,
    ) -> bool:
        return any(
            uploaded_file.user_id == user_id
            and uploaded_file.original_filename == original_filename
            and uploaded_file.status in {"active", "deleting"}
            for uploaded_file in self.uploaded_files
        )

    def delete_deleted_by_user_and_original_filename(
        self,
        *,
        user_id: str,
        original_filename: str,
    ) -> None:
        self.uploaded_files = [
            uploaded_file
            for uploaded_file in self.uploaded_files
            if not (
                uploaded_file.user_id == user_id
                and uploaded_file.original_filename == original_filename
                and uploaded_file.status == "deleted"
            )
        ]

    def list_by_user(
        self,
        *,
        user_id: str,
        limit: int,
        offset: int,
    ) -> list[UploadedFile]:
        matching_files = [
            uploaded_file
            for uploaded_file in self.uploaded_files
            if uploaded_file.user_id == user_id and uploaded_file.status == "active"
        ]
        return matching_files[offset : offset + limit]

    def find_by_id_for_user(
        self,
        *,
        user_id: str,
        file_id: str,
    ) -> UploadedFile | None:
        return next(
            (
                uploaded_file
                for uploaded_file in self.uploaded_files
                if uploaded_file.user_id == user_id
                and uploaded_file.id == file_id
                and uploaded_file.status == "active"
            ),
            None,
        )

    def find_many_by_ids_for_user(
        self,
        *,
        user_id: str,
        file_ids: list[str],
    ) -> list[UploadedFile]:
        self.find_many_calls.append({"user_id": user_id, "file_ids": file_ids})
        return [
            uploaded_file
            for uploaded_file in self.uploaded_files
            if uploaded_file.user_id == user_id
            and uploaded_file.id in file_ids
            and uploaded_file.status in {"active", "deleting"}
        ]

    def mark_as_deleting_by_ids_for_user(
        self,
        *,
        user_id: str,
        file_ids: list[str],
    ) -> list[str]:
        del user_id
        return file_ids

    def mark_as_deleted_by_ids_for_user(
        self,
        *,
        user_id: str,
        file_ids: list[str],
    ) -> None:
        del user_id, file_ids


def test_prepare_file_download_authorizes_active_files_for_user() -> None:
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                original_filename="photo.png",
                storage_provider="s3",
                storage_key="users/user-123/file-123.png",
                content_type="image/png",
                size_bytes=42,
            ),
            _uploaded_file(
                id="file-456",
                user_id="user-123",
                original_filename="notes.txt",
                storage_provider="s3",
                storage_key="users/user-123/file-456.txt",
                content_type="text/plain",
                size_bytes=None,
            ),
            _uploaded_file(id="file-999", user_id="other-user"),
        ]
    )
    use_case = PrepareFileDownloadUseCase(uploaded_file_repository=repository)

    result = use_case.execute(
        PrepareFileDownloadInput(
            user_id="user-123",
            file_ids=["file-123", "file-456"],
        )
    )

    assert repository.find_many_calls == [
        {"user_id": "user-123", "file_ids": ["file-123", "file-456"]}
    ]
    assert result.files[0].id == "file-123"
    assert result.files[0].original_filename == "photo.png"
    assert result.files[0].storage_provider == "s3"
    assert result.files[0].storage_key == "users/user-123/file-123.png"
    assert result.files[0].content_type == "image/png"
    assert result.files[0].size_bytes == 42
    assert result.files[1].id == "file-456"
    assert result.files[1].original_filename == "notes.txt"
    assert result.files[1].storage_provider == "s3"
    assert result.files[1].storage_key == "users/user-123/file-456.txt"
    assert result.files[1].content_type == "text/plain"
    assert result.files[1].size_bytes is None


def test_prepare_file_download_deduplicates_file_ids() -> None:
    repository = FakeUploadedFileRepository(
        [_uploaded_file(id="file-123", user_id="user-123")]
    )
    use_case = PrepareFileDownloadUseCase(uploaded_file_repository=repository)

    result = use_case.execute(
        PrepareFileDownloadInput(
            user_id="user-123",
            file_ids=["file-123", "file-123"],
        )
    )

    assert repository.find_many_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert [file.id for file in result.files] == ["file-123"]


def test_prepare_file_download_rejects_another_users_file() -> None:
    repository = FakeUploadedFileRepository(
        [_uploaded_file(id="file-999", user_id="other-user")]
    )
    use_case = PrepareFileDownloadUseCase(uploaded_file_repository=repository)

    with pytest.raises(UploadedFileNotFoundError, match="file not found"):
        use_case.execute(
            PrepareFileDownloadInput(
                user_id="user-123",
                file_ids=["file-999"],
            )
        )


def test_prepare_file_download_rejects_deleted_file() -> None:
    repository = FakeUploadedFileRepository(
        [_uploaded_file(id="file-123", user_id="user-123", status="deleted")]
    )
    use_case = PrepareFileDownloadUseCase(uploaded_file_repository=repository)

    with pytest.raises(UploadedFileNotFoundError, match="file not found"):
        use_case.execute(
            PrepareFileDownloadInput(
                user_id="user-123",
                file_ids=["file-123"],
            )
        )


def test_prepare_file_download_rejects_deleting_file() -> None:
    repository = FakeUploadedFileRepository(
        [_uploaded_file(id="file-123", user_id="user-123", status="deleting")]
    )
    use_case = PrepareFileDownloadUseCase(uploaded_file_repository=repository)

    with pytest.raises(UploadedFileNotFoundError, match="file not found"):
        use_case.execute(
            PrepareFileDownloadInput(
                user_id="user-123",
                file_ids=["file-123"],
            )
        )


def test_prepare_file_download_fails_whole_request_when_any_file_is_unavailable() -> None:
    repository = FakeUploadedFileRepository(
        [_uploaded_file(id="file-123", user_id="user-123")]
    )
    use_case = PrepareFileDownloadUseCase(uploaded_file_repository=repository)

    with pytest.raises(UploadedFileNotFoundError, match="file not found"):
        use_case.execute(
            PrepareFileDownloadInput(
                user_id="user-123",
                file_ids=["file-123", "file-404"],
            )
        )


def _uploaded_file(
    *,
    id: str,
    user_id: str,
    status: str = "active",
    original_filename: str = "sample.txt",
    storage_provider: str = "fake_cloud",
    storage_key: str | None = None,
    content_type: str = "text/plain",
    size_bytes: int | None = 5,
) -> UploadedFile:
    return UploadedFile(
        id=id,
        user_id=user_id,
        storage_provider=storage_provider,
        storage_key=storage_key or f"users/{user_id}/{id}.txt",
        thumbnail_storage_provider=None,
        thumbnail_storage_key=None,
        thumbnail_content_type=None,
        original_filename=original_filename,
        content_type=content_type,
        size_bytes=size_bytes,
        created_at=datetime(2026, 4, 26, 14, 30, tzinfo=UTC),
        status=status,
    )
