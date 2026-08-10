import os
from dataclasses import dataclass
from functools import lru_cache

from app.application.ports.access_token_decoder import AccessTokenDecoder
from app.application.use_cases.authenticate_user import AuthenticateUserUseCase
from app.application.use_cases.logout import LogoutUseCase
from app.application.use_cases.register_user import RegisterUserUseCase
from app.domain.services.password_policy import PasswordPolicy
from app.environment import load_environment
from app.infrastructure.repositories.postgres_session_repository import (
    PostgresSessionRepository,
)
from app.infrastructure.repositories.postgres_user_repository import (
    PostgresUserRepository,
)
from app.infrastructure.security.jwt_access_token_decoder import JwtAccessTokenDecoder
from app.infrastructure.security.jwt_access_token_issuer import JwtAccessTokenIssuer
from app.infrastructure.security.password_hasher import PBKDF2PasswordHasher

MAGALU_OBJECT_STORAGE_PROVIDER = "magalu_object_storage"
MAGALU_S3_SIGNATURE_VERSION = "s3v4"
MAGALU_S3_ADDRESSING_STYLE = "path"


@dataclass(slots=True, frozen=True)
class AppContainer:
    register_user_use_case: RegisterUserUseCase
    authenticate_user_use_case: AuthenticateUserUseCase
    logout_use_case: LogoutUseCase
    upload_file_use_case: UploadFileUseCase
    list_uploaded_file_use_case: ListUploadedFilesUseCase
    get_file_view_url_use_case: GetFileViewUrlUseCase
    prepare_file_download_use_case: PrepareFileDownloadUseCase
    prepare_permanent_file_deletion_use_case: PreparePermanentFileDeletionUseCase
    access_token_decoder: AccessTokenDecoder
    file_storage_registry: FileStorageRegistry


@lru_cache
def build_container() -> AppContainer:
    load_environment()
    database_url = _get_required_env(
        "DATABASE_URL",
        message=(
            "DATABASE_URL is not configured. Set it in the environment or in "
            "apps/backend/.env."
        ),
    )
    password_hash_iterations = _get_positive_int_env(
        "PASSWORD_HASH_ITERATIONS",
        default=600_000,
    )
    password_hash_salt_bytes = _get_positive_int_env(
        "PASSWORD_HASH_SALT_BYTES",
        default=16,
    )
    jwt_secret = _get_required_env("JWT_SECRET")
    jwt_issuer = _get_required_env("JWT_ISSUER")
    jwt_audience = _get_required_env("JWT_AUDIENCE")
    aws_region = _get_required_env("AWS_REGION")
    aws_s3_bucket_name = _get_required_env("AWS_S3_BUCKET_NAME")
    magalu_key_id = _get_required_env("MAGALU_KEY_ID")
    magalu_secret_key = _get_required_env("MAGALU_SECRET_KEY")
    magalu_region = _get_required_env("MAGALU_REGION")
    magalu_endpoint_url = _get_required_env("MAGALU_ENDPOINT_URL")
    magalu_bucket_name = _get_required_env("MAGALU_BUCKET_NAME")
    gcp_project_id = _get_required_env("GCP_PROJECT_ID")
    gcs_bucket_name = _get_required_env("GCS_BUCKET_NAME")
    access_token_expires_seconds = _get_positive_int_env(
        "ACCESS_TOKEN_EXPIRES_SECONDS",
        default=900,
    )

    user_repository = PostgresUserRepository(database_url=database_url)
    session_repository = PostgresSessionRepository(database_url=database_url)
    uploaded_file_repository = PostgresUploadedFileRepository(database_url=database_url)
    thumbnail_generator = DefaultThumbnailGenerator()
    password_policy = PasswordPolicy()
    password_hasher = PBKDF2PasswordHasher(
        iterations=password_hash_iterations,
        salt_bytes=password_hash_salt_bytes,
    )
    access_token_issuer = JwtAccessTokenIssuer(
        secret=jwt_secret,
        issuer=jwt_issuer,
        audience=jwt_audience,
        expires_in_seconds=access_token_expires_seconds,
    )
    access_token_decoder = JwtAccessTokenDecoder(
        secret=jwt_secret,
        issuer=jwt_issuer,
        audience=jwt_audience,
    )
    aws_s3_file_storage = S3CompatibleFileStorage(
        bucket_name=aws_s3_bucket_name,
        region=aws_region,
    )
    magalu_file_storage = _build_magalu_file_storage(
        bucket_name=magalu_bucket_name,
        region=magalu_region,
        endpoint_url=magalu_endpoint_url,
        access_key_id=magalu_key_id,
        secret_access_key=magalu_secret_key,
    )
    google_cloud_file_storage = GoogleCloudFileStorage(
        bucket_name=gcs_bucket_name,
        project_id=gcp_project_id,
    )
    file_storage_registry = StaticFileStorageRegistry(
        storages={
            aws_s3_file_storage.provider: aws_s3_file_storage,
            magalu_file_storage.provider: magalu_file_storage,
            google_cloud_file_storage.provider: google_cloud_file_storage,
        },
    )

    return AppContainer(
        register_user_use_case=RegisterUserUseCase(
            user_repository=user_repository,
            password_policy=password_policy,
            password_hasher=password_hasher,
        ),
        authenticate_user_use_case=AuthenticateUserUseCase(
            user_repository=user_repository,
            session_repository=session_repository,
            password_hasher=password_hasher,
            access_token_issuer=access_token_issuer,
            access_token_expires_seconds=access_token_expires_seconds,
        ),
        logout_use_case=LogoutUseCase(
            session_repository=session_repository,
        ),
        upload_file_use_case=UploadFileUseCase(
            file_storage_registry=file_storage_registry,
            uploaded_file_repository=uploaded_file_repository,
            thumbnail_generator=thumbnail_generator,
        ),
        list_uploaded_file_use_case=ListUploadedFilesUseCase(
            uploaded_file_repository=uploaded_file_repository,
            file_storage_registry=file_storage_registry,
        ),
        get_file_view_url_use_case=GetFileViewUrlUseCase(
            uploaded_file_repository=uploaded_file_repository,
            file_storage_registry=file_storage_registry,
        ),
        prepare_file_download_use_case=PrepareFileDownloadUseCase(
            uploaded_file_repository=uploaded_file_repository,
        ),
        prepare_permanent_file_deletion_use_case=(
            PreparePermanentFileDeletionUseCase(
                uploaded_file_repository=uploaded_file_repository,
                file_storage_registry=file_storage_registry,
            )
        ),
        access_token_decoder=access_token_decoder,
        file_storage_registry=file_storage_registry,
    )


def _build_magalu_file_storage(
    *,
    bucket_name: str,
    region: str,
    endpoint_url: str,
    access_key_id: str,
    secret_access_key: str,
) -> S3CompatibleFileStorage:
    return S3CompatibleFileStorage(
        bucket_name=bucket_name,
        region=region,
        endpoint_url=endpoint_url,
        access_key_id=access_key_id,
        secret_access_key=secret_access_key,
        signature_version=MAGALU_S3_SIGNATURE_VERSION,
        addressing_style=MAGALU_S3_ADDRESSING_STYLE,
        provider=MAGALU_OBJECT_STORAGE_PROVIDER,
    )


def _get_positive_int_env(name: str, *, default: int) -> int:
    raw_value = os.getenv(name)
    if raw_value is None or not raw_value.strip():
        return default

    value = int(raw_value)
    if value <= 0:
        raise RuntimeError(f"{name} must be a positive integer")
    return value


def _get_required_env(name: str, *, message: str | None = None) -> str:
    value = os.getenv(name)
    if value is None or not value.strip():
        raise RuntimeError(message or f"{name} is not configured")
    return value
