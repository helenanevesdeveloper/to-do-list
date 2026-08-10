from datetime import UTC, datetime
from io import BytesIO
from typing import BinaryIO, cast

from app.application.dto.prepare_permanent_file_deletion_input import (
    PreparePermanentFileDeletionInput,
)
from app.application.ports.file_storage import CloudStorageProvider
from app.application.ports.uploaded_file_repository import UploadedFileRepository
from app.application.use_cases.prepare_permanent_file_deletion import (
    PreparePermanentFileDeletionUseCase,
)
from app.domain.entities.uploaded_file import UploadedFile
from app.domain.exceptions import FileStorageError


class FakeUploadedFileRepository:
    def __init__(
        self,
        uploaded_files: list[UploadedFile],
        *,
        marked_file_ids: list[str] | None = None,
    ) -> None:
        self.uploaded_files = uploaded_files
        self.marked_file_ids = marked_file_ids
        self.find_many_calls: list[dict[str, object]] = []
        self.mark_as_deleting_calls: list[dict[str, object]] = []
        self.mark_as_deleted_calls: list[dict[str, object]] = []

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
        self.mark_as_deleting_calls.append(
            {"user_id": user_id, "file_ids": file_ids}
        )
        return self.marked_file_ids if self.marked_file_ids is not None else file_ids

    def mark_as_deleted_by_ids_for_user(
        self,
        *,
        user_id: str,
        file_ids: list[str],
    ) -> None:
        self.mark_as_deleted_calls.append(
            {"user_id": user_id, "file_ids": file_ids}
        )


class FakeFileStorage:
    provider: str = "fake_cloud"

    def __init__(self, *, failing_object_keys: set[str] | None = None) -> None:
        self.failing_object_keys = failing_object_keys or set()
        self.deleted_object_keys: list[str] = []

    def upload(
        self,
        *,
        file: BinaryIO,
        object_key: str,
        content_type: str,
    ) -> None:
        del file, object_key, content_type

    def create_read_url(
        self,
        *,
        object_key: str,
        expires_in_seconds: int,
    ) -> str:
        del object_key, expires_in_seconds
        return "https://fake-cloud.test/read"

    def open_read_stream(
        self,
        *,
        object_key: str,
    ) -> BinaryIO:
        del object_key
        return BytesIO(b"file-bytes")

    def delete_objects(
        self,
        *,
        object_keys: list[str],
    ) -> None:
        if any(object_key in self.failing_object_keys for object_key in object_keys):
            raise FileStorageError("file storage is unavailable")
        self.deleted_object_keys.extend(object_keys)


class FakeFileStorageRegistry:
    def __init__(self, storage: CloudStorageProvider) -> None:
        self.storage = storage

    def get(self, provider: str) -> CloudStorageProvider:
        assert provider == "fake_cloud"
        return self.storage


def test_prepare_permanent_file_deletion_returns_deleted_files_after_storage_delete() -> None:
    storage = FakeFileStorage()
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.png",
                thumbnail_storage_key="thumbnails/users/user-123/file-123.jpg",
            ),
            _uploaded_file(
                id="file-999",
                user_id="other-user",
                storage_key="users/other-user/file-999.png",
            ),
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123"],
        )
    )

    assert repository.find_many_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert repository.mark_as_deleting_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert storage.deleted_object_keys == [
        "users/user-123/file-123.png",
        "thumbnails/users/user-123/file-123.jpg",
    ]
    assert repository.mark_as_deleted_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert result.deleted == ["file-123"]
    assert result.failed == []


def test_prepare_permanent_file_deletion_deduplicates_file_ids() -> None:
    storage = FakeFileStorage()
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.png",
            )
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123", "file-123"],
        )
    )

    assert result.deleted == ["file-123"]
    assert result.failed == []
    assert repository.find_many_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert repository.mark_as_deleting_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert storage.deleted_object_keys == ["users/user-123/file-123.png"]
    assert repository.mark_as_deleted_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]


def test_prepare_permanent_file_deletion_reports_missing_or_unowned_files() -> None:
    storage = FakeFileStorage()
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.png",
            ),
            _uploaded_file(
                id="file-999",
                user_id="other-user",
                storage_key="users/other-user/file-999.png",
            ),
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123", "file-999"],
        )
    )

    assert result.deleted == ["file-123"]
    assert [(failure.file_id, failure.reason) for failure in result.failed] == [
        ("file-999", "not_found")
    ]
    assert repository.mark_as_deleting_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert repository.mark_as_deleted_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert storage.deleted_object_keys == ["users/user-123/file-123.png"]


def test_prepare_permanent_file_deletion_cannot_delete_another_users_file() -> None:
    storage = FakeFileStorage()
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-999",
                user_id="other-user",
                storage_key="users/other-user/file-999.png",
                thumbnail_storage_key="thumbnails/users/other-user/file-999.jpg",
            ),
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-999"],
        )
    )

    assert result.deleted == []
    assert [(failure.file_id, failure.reason) for failure in result.failed] == [
        ("file-999", "not_found")
    ]
    assert repository.mark_as_deleting_calls == [
        {"user_id": "user-123", "file_ids": []}
    ]
    assert repository.mark_as_deleted_calls == []
    assert storage.deleted_object_keys == []


def test_prepare_permanent_file_deletion_missing_thumbnail_does_not_fail() -> None:
    storage = FakeFileStorage()
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.txt",
                thumbnail_storage_key=None,
            )
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123"],
        )
    )

    assert result.deleted == ["file-123"]
    assert result.failed == []
    assert storage.deleted_object_keys == ["users/user-123/file-123.txt"]
    assert repository.mark_as_deleted_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]


def test_prepare_permanent_file_deletion_finalizes_already_deleting_files() -> None:
    storage = FakeFileStorage()
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.png",
                status="deleting",
            )
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123"],
        )
    )

    assert result.deleted == ["file-123"]
    assert result.failed == []
    assert repository.mark_as_deleting_calls == [
        {"user_id": "user-123", "file_ids": []}
    ]
    assert storage.deleted_object_keys == ["users/user-123/file-123.png"]
    assert repository.mark_as_deleted_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]


def test_prepare_permanent_file_deletion_reports_storage_failures() -> None:
    storage = FakeFileStorage(
        failing_object_keys={"users/user-123/file-123.png"},
    )
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.png",
            )
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123"],
        )
    )

    assert result.deleted == []
    assert [(failure.file_id, failure.reason) for failure in result.failed] == [
        ("file-123", "storage_delete_failed")
    ]
    assert repository.mark_as_deleting_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]
    assert repository.mark_as_deleted_calls == []


def test_prepare_permanent_file_deletion_continues_after_one_storage_failure() -> None:
    storage = FakeFileStorage(
        failing_object_keys={"users/user-123/file-456.png"},
    )
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.png",
            ),
            _uploaded_file(
                id="file-456",
                user_id="user-123",
                storage_key="users/user-123/file-456.png",
            ),
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123", "file-456"],
        )
    )

    assert result.deleted == ["file-123"]
    assert [(failure.file_id, failure.reason) for failure in result.failed] == [
        ("file-456", "storage_delete_failed")
    ]
    assert storage.deleted_object_keys == ["users/user-123/file-123.png"]
    assert repository.mark_as_deleted_calls == [
        {"user_id": "user-123", "file_ids": ["file-123"]}
    ]


def test_prepare_permanent_file_deletion_reports_concurrent_delete_attempt() -> None:
    storage = FakeFileStorage()
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.png",
            )
        ],
        marked_file_ids=[],
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123"],
        )
    )

    assert result.deleted == []
    assert [(failure.file_id, failure.reason) for failure in result.failed] == [
        ("file-123", "delete_already_in_progress")
    ]
    assert storage.deleted_object_keys == []
    assert repository.mark_as_deleted_calls == []


def test_prepare_permanent_file_deletion_repeated_request_after_deleted_is_safe() -> None:
    storage = FakeFileStorage()
    repository = FakeUploadedFileRepository(
        [
            _uploaded_file(
                id="file-123",
                user_id="user-123",
                storage_key="users/user-123/file-123.png",
                status="deleted",
            )
        ]
    )
    use_case = PreparePermanentFileDeletionUseCase(
        uploaded_file_repository=cast(UploadedFileRepository, repository),
        file_storage_registry=FakeFileStorageRegistry(storage),
    )

    result = use_case.execute(
        PreparePermanentFileDeletionInput(
            user_id="user-123",
            file_ids=["file-123"],
        )
    )

    assert result.deleted == []
    assert [(failure.file_id, failure.reason) for failure in result.failed] == [
        ("file-123", "not_found")
    ]
    assert repository.mark_as_deleting_calls == [
        {"user_id": "user-123", "file_ids": []}
    ]
    assert repository.mark_as_deleted_calls == []
    assert storage.deleted_object_keys == []


def _uploaded_file(
    *,
    id: str,
    user_id: str,
    storage_key: str,
    thumbnail_storage_key: str | None = None,
    status: str = "active",
    deleted_at: datetime | None = None,
) -> UploadedFile:
    return UploadedFile(
        id=id,
        user_id=user_id,
        storage_provider="fake_cloud",
        storage_key=storage_key,
        thumbnail_storage_provider=(
            "fake_cloud" if thumbnail_storage_key is not None else None
        ),
        thumbnail_storage_key=thumbnail_storage_key,
        thumbnail_content_type="image/jpeg" if thumbnail_storage_key else None,
        original_filename="sample.txt",
        content_type="text/plain",
        size_bytes=5,
        created_at=datetime(2026, 4, 26, 14, 30, tzinfo=UTC),
        status=status,
        deleted_at=deleted_at,
    )
