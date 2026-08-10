from io import BytesIO
from typing import BinaryIO

import pytest

from app.application.dto.upload_file_input import UploadFileInput
from app.application.ports.file_storage import CloudStorageProvider
from app.application.ports.thumbnail_generator import GeneratedThumbnail
from app.application.use_cases.upload_file import UploadFileUseCase
from app.domain.entities.uploaded_file import UploadedFile
from app.domain.exceptions import UploadedFileAlreadyExistsError


class FakeFileStorage:
    provider: str = "fake_cloud"

    def __init__(self, *, close_after_store: bool = False) -> None:
        self.calls: list[dict[str, object]] = []
        self.close_after_store = close_after_store

    def upload(
        self,
        *,
        file: BinaryIO,
        object_key: str,
        content_type: str,
    ) -> None:
        file.seek(0)
        file_bytes = file.read()
        file.seek(0)
        self.calls.append(
            {
                "object_key": object_key,
                "content_type": content_type,
                "file_bytes": file_bytes,
            }
        )
        if self.close_after_store:
            file.close()

    def create_read_url(
        self,
        *,
        object_key: str,
        expires_in_seconds: int,
    ) -> str:
        return f"https://fake-cloud.test/{object_key}?ttl={expires_in_seconds}"

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
        del object_keys


class FakeFileStorageRegistry:
    def __init__(self, storage: CloudStorageProvider) -> None:
        self.storage = storage
        self.calls: list[str] = []

    def get(self, provider: str) -> CloudStorageProvider:
        self.calls.append(provider)
        return self.storage


class FakeUploadedFileRepository:
    def __init__(
        self,
        *,
        existing_filenames: set[tuple[str, str]] | None = None,
        deleted_filenames: set[tuple[str, str]] | None = None,
    ) -> None:
        self.existing_filenames = existing_filenames or set()
        self.deleted_filenames = deleted_filenames or set()
        self.delete_deleted_calls: list[dict[str, str]] = []
        self.exists_calls: list[dict[str, str]] = []
        self.saved: list[UploadedFile] = []

    def exists_by_user_and_original_filename(
        self,
        *,
        user_id: str,
        original_filename: str,
    ) -> bool:
        self.exists_calls.append(
            {"user_id": user_id, "original_filename": original_filename}
        )
        return (user_id, original_filename) in self.existing_filenames

    def delete_deleted_by_user_and_original_filename(
        self,
        *,
        user_id: str,
        original_filename: str,
    ) -> None:
        self.delete_deleted_calls.append(
            {"user_id": user_id, "original_filename": original_filename}
        )
        self.deleted_filenames.discard((user_id, original_filename))

    def save(self, uploaded_file: UploadedFile) -> UploadedFile:
        self.saved.append(uploaded_file)
        return uploaded_file

    def list_by_user(
        self,
        *,
        user_id: str,
        limit: int,
        offset: int,
    ) -> list[UploadedFile]:
        matching_files = [
            uploaded_file
            for uploaded_file in self.saved
            if uploaded_file.user_id == user_id
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
                for uploaded_file in self.saved
                if uploaded_file.user_id == user_id and uploaded_file.id == file_id
            ),
            None,
        )

    def find_many_by_ids_for_user(
        self,
        *,
        user_id: str,
        file_ids: list[str],
    ) -> list[UploadedFile]:
        return [
            uploaded_file
            for uploaded_file in self.saved
            if uploaded_file.user_id == user_id and uploaded_file.id in file_ids
        ]

    def mark_as_deleting_by_ids_for_user(
        self,
        *,
        user_id: str,
        file_ids: list[str],
    ) -> list[str]:
        del user_id, file_ids
        return []

    def mark_as_deleted_by_ids_for_user(
        self,
        *,
        user_id: str,
        file_ids: list[str],
    ) -> None:
        del user_id, file_ids


class FakeThumbnailGenerator:
    def __init__(self, *, should_generate: bool) -> None:
        self.should_generate = should_generate
        self.calls: list[dict[str, object]] = []

    def generate(
        self,
        *,
        file: BinaryIO,
        content_type: str,
    ) -> GeneratedThumbnail | None:
        self.calls.append({"content_type": content_type})
        if not self.should_generate:
            return None
        file.seek(0)
        file.read()
        file.seek(0)
        return GeneratedThumbnail(file=BytesIO(b"thumb"), content_type="image/jpeg")


def test_upload_file_use_case_returns_object_key() -> None:
    file_storage = FakeFileStorage()
    uploaded_file_repository = FakeUploadedFileRepository()
    use_case = UploadFileUseCase(
        file_storage_registry=FakeFileStorageRegistry(file_storage),
        uploaded_file_repository=uploaded_file_repository,
        thumbnail_generator=FakeThumbnailGenerator(should_generate=False),
        generate_file_id=lambda: "file-123",
        generate_object_id=lambda: "object-123",
    )

    result = use_case.execute(
        UploadFileInput(
            user_id="user-123",
            storage_provider="fake_cloud",
            original_filename="sample.txt",
            content_type="text/plain",
            file=BytesIO(b"hello"),
        )
    )

    assert result.id == "file-123"
    assert result.object_key == "users/user-123/object-123-sample.txt"
    assert file_storage.calls == [
        {
            "object_key": "users/user-123/object-123-sample.txt",
            "content_type": "text/plain",
            "file_bytes": b"hello",
        }
    ]
    assert len(uploaded_file_repository.saved) == 1
    saved = uploaded_file_repository.saved[0]
    assert saved.id == "file-123"
    assert saved.user_id == "user-123"
    assert saved.storage_provider == "fake_cloud"
    assert saved.storage_key == "users/user-123/object-123-sample.txt"
    assert saved.original_filename == "sample.txt"
    assert saved.content_type == "text/plain"
    assert saved.size_bytes == 5
    assert saved.thumbnail_storage_provider is None
    assert saved.thumbnail_storage_key is None
    assert saved.thumbnail_content_type is None


def test_upload_file_use_case_sanitizes_original_filename() -> None:
    uploaded_file_repository = FakeUploadedFileRepository()
    use_case = UploadFileUseCase(
        file_storage_registry=FakeFileStorageRegistry(FakeFileStorage()),
        uploaded_file_repository=uploaded_file_repository,
        thumbnail_generator=FakeThumbnailGenerator(should_generate=False),
        generate_file_id=lambda: "file-123",
        generate_object_id=lambda: "object-123",
    )

    result = use_case.execute(
        UploadFileInput(
            user_id="user-123",
            storage_provider="fake_cloud",
            original_filename="../Quarterly Report (final).pdf",
            content_type="application/pdf",
            file=BytesIO(b"hello"),
        )
    )

    assert (
        result.object_key
        == "users/user-123/object-123-Quarterly-Report-_final_.pdf"
    )
    assert len(uploaded_file_repository.saved) == 1
    assert uploaded_file_repository.saved[0].original_filename == (
        "Quarterly Report (final).pdf"
    )


def test_upload_file_use_case_generates_distinct_keys_for_same_filename() -> None:
    object_ids = iter(["object-123", "object-456"])
    file_ids = iter(["file-123", "file-456"])
    use_case = UploadFileUseCase(
        file_storage_registry=FakeFileStorageRegistry(FakeFileStorage()),
        uploaded_file_repository=FakeUploadedFileRepository(),
        thumbnail_generator=FakeThumbnailGenerator(should_generate=False),
        generate_file_id=lambda: next(file_ids),
        generate_object_id=lambda: next(object_ids),
    )
    input_dto = UploadFileInput(
        user_id="user-123",
        storage_provider="fake_cloud",
        original_filename="sample.txt",
        content_type="text/plain",
        file=BytesIO(b"hello"),
    )

    first_result = use_case.execute(input_dto)
    second_result = use_case.execute(input_dto)

    assert first_result.object_key == "users/user-123/object-123-sample.txt"
    assert second_result.object_key == "users/user-123/object-456-sample.txt"
    assert first_result.object_key != second_result.object_key
    assert first_result.id == "file-123"
    assert second_result.id == "file-456"


def test_upload_file_use_case_stores_thumbnail_when_generator_returns_one() -> None:
    file_storage = FakeFileStorage()
    uploaded_file_repository = FakeUploadedFileRepository()
    use_case = UploadFileUseCase(
        file_storage_registry=FakeFileStorageRegistry(file_storage),
        uploaded_file_repository=uploaded_file_repository,
        thumbnail_generator=FakeThumbnailGenerator(should_generate=True),
        generate_file_id=lambda: "file-123",
        generate_object_id=lambda: "object-123",
    )

    result = use_case.execute(
        UploadFileInput(
            user_id="user-123",
            storage_provider="fake_cloud",
            original_filename="photo.png",
            content_type="image/png",
            file=BytesIO(b"image-bytes"),
        )
    )

    assert result.id == "file-123"
    assert len(file_storage.calls) == 2
    assert file_storage.calls[0]["object_key"] == (
        "users/user-123/object-123-photo.png"
    )
    assert file_storage.calls[1]["object_key"] == (
        "thumbnails/users/user-123/file-123-photo.jpg"
    )

    saved = uploaded_file_repository.saved[0]
    assert saved.thumbnail_storage_provider == "fake_cloud"
    assert saved.thumbnail_storage_key == (
        "thumbnails/users/user-123/file-123-photo.jpg"
    )
    assert saved.thumbnail_content_type == "image/jpeg"


def test_upload_file_use_case_generates_thumbnail_after_storage_closes_stream() -> None:
    file_storage = FakeFileStorage(close_after_store=True)
    uploaded_file_repository = FakeUploadedFileRepository()
    use_case = UploadFileUseCase(
        file_storage_registry=FakeFileStorageRegistry(file_storage),
        uploaded_file_repository=uploaded_file_repository,
        thumbnail_generator=FakeThumbnailGenerator(should_generate=True),
        generate_file_id=lambda: "file-123",
        generate_object_id=lambda: "object-123",
    )

    use_case.execute(
        UploadFileInput(
            user_id="user-123",
            storage_provider="fake_cloud",
            original_filename="photo.png",
            content_type="image/png",
            file=BytesIO(b"image-bytes"),
        )
    )

    assert len(file_storage.calls) == 2
    assert file_storage.calls[1]["object_key"] == (
        "thumbnails/users/user-123/file-123-photo.jpg"
    )


def test_upload_file_use_case_rejects_duplicate_filename_for_same_user() -> None:
    file_storage = FakeFileStorage()
    uploaded_file_repository = FakeUploadedFileRepository(
        existing_filenames={("user-123", "photo.png")}
    )
    thumbnail_generator = FakeThumbnailGenerator(should_generate=True)
    use_case = UploadFileUseCase(
        file_storage_registry=FakeFileStorageRegistry(file_storage),
        uploaded_file_repository=uploaded_file_repository,
        thumbnail_generator=thumbnail_generator,
        generate_file_id=lambda: "file-123",
        generate_object_id=lambda: "object-123",
    )

    with pytest.raises(
        UploadedFileAlreadyExistsError,
        match="file named 'photo.png' already exists",
    ):
        use_case.execute(
            UploadFileInput(
                user_id="user-123",
                storage_provider="fake_cloud",
                original_filename="../photo.png",
                content_type="image/png",
                file=BytesIO(b"image-bytes"),
            )
        )

    assert uploaded_file_repository.saved == []
    assert file_storage.calls == []
    assert thumbnail_generator.calls == []


def test_upload_file_use_case_deletes_soft_deleted_duplicate_before_saving() -> None:
    uploaded_file_repository = FakeUploadedFileRepository(
        deleted_filenames={("user-123", "photo.png")}
    )
    use_case = UploadFileUseCase(
        file_storage_registry=FakeFileStorageRegistry(FakeFileStorage()),
        uploaded_file_repository=uploaded_file_repository,
        thumbnail_generator=FakeThumbnailGenerator(should_generate=False),
        generate_file_id=lambda: "file-123",
        generate_object_id=lambda: "object-123",
    )

    result = use_case.execute(
        UploadFileInput(
            user_id="user-123",
            storage_provider="fake_cloud",
            original_filename="../photo.png",
            content_type="image/png",
            file=BytesIO(b"image-bytes"),
        )
    )

    assert result.id == "file-123"
    assert uploaded_file_repository.delete_deleted_calls == [
        {"user_id": "user-123", "original_filename": "photo.png"}
    ]
    assert ("user-123", "photo.png") not in uploaded_file_repository.deleted_filenames
    assert len(uploaded_file_repository.saved) == 1


def test_upload_file_use_case_allows_same_filename_for_different_user() -> None:
    uploaded_file_repository = FakeUploadedFileRepository(
        existing_filenames={("user-456", "photo.png")}
    )
    use_case = UploadFileUseCase(
        file_storage_registry=FakeFileStorageRegistry(FakeFileStorage()),
        uploaded_file_repository=uploaded_file_repository,
        thumbnail_generator=FakeThumbnailGenerator(should_generate=False),
        generate_file_id=lambda: "file-123",
        generate_object_id=lambda: "object-123",
    )

    result = use_case.execute(
        UploadFileInput(
            user_id="user-123",
            storage_provider="fake_cloud",
            original_filename="photo.png",
            content_type="image/png",
            file=BytesIO(b"image-bytes"),
        )
    )

    assert result.id == "file-123"
    assert len(uploaded_file_repository.saved) == 1
