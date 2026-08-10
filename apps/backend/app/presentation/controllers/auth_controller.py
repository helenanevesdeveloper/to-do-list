from fastapi import APIRouter, Depends, status

from app.application.dto.authenticate_user_input import AuthenticateUserInput
from app.application.dto.logout_input import LogoutInput
from app.application.use_cases.authenticate_user import AuthenticateUserUseCase
from app.application.use_cases.logout import LogoutUseCase
from app.application.dto.register_user_input import RegisterUserInput
from app.application.use_cases.register_user import RegisterUserUseCase
from app.container import build_container
from app.presentation.auth_context import (
    CurrentAuthContext,
    get_current_auth_context,
)
from app.presentation.schemas.auth import (
    ErrorResponse,
    LoginRequest,
    LoginResponse,
    RegisterUserRequest,
    RegisterUserResponse,
    ValidationErrorResponse,
)

router = APIRouter(tags=["auth"])


def get_register_user_use_case() -> RegisterUserUseCase:
    return build_container().register_user_use_case


def get_authenticate_user_use_case() -> AuthenticateUserUseCase:
    return build_container().authenticate_user_use_case


def get_logout_use_case() -> LogoutUseCase:
    return build_container().logout_use_case


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ValidationErrorResponse,
            "description": "Domain validation error",
        },
        status.HTTP_409_CONFLICT: {
            "model": ErrorResponse,
            "description": "User already exists",
        }
    },
)
async def register_user(
    payload: RegisterUserRequest,
    use_case: RegisterUserUseCase = Depends(get_register_user_use_case),
) -> RegisterUserResponse:
    result = use_case.execute(
        RegisterUserInput(
            email=str(payload.email),
            password=payload.password,
        )
    )
    return RegisterUserResponse(
        id=result.id,
        email=result.email,
        created_at=result.created_at,
        is_active=result.is_active,
    )


@router.post(
    "/login",
    response_model=LoginResponse,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "model": ErrorResponse,
            "description": "Invalid credentials or inactive user",
        },
    },
)
async def login_user(
    payload: LoginRequest,
    use_case: AuthenticateUserUseCase = Depends(
        get_authenticate_user_use_case
    ),
) -> LoginResponse:
    result = use_case.execute(
        AuthenticateUserInput(
            email=str(payload.email),
            password=payload.password,
        )
    )
    return LoginResponse(
        access_token=result.access_token,
        token_type=result.token_type,
    )


@router.post(
    "/logout",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "model": ErrorResponse,
            "description": "User is not authenticated or token is invalid",
        },
    },
)
async def logout_user(
    auth_context: CurrentAuthContext = Depends(get_current_auth_context),
    use_case: LogoutUseCase = Depends(get_logout_use_case),
) -> None:
    use_case.execute(LogoutInput(session_id=auth_context.session_id))
