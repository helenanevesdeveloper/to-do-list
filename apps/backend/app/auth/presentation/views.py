from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from app.auth.application.dto import (
    AuthenticateUserInput,
    LogoutInput,
    RegisterUserInput,
)
from app.auth.presentation.drf_authentication import JwtAuthContext
from app.shared.http import AuthenticatedAPIView

from .dependencies import (
    get_authenticate_user_use_case,
    get_logout_use_case,
    get_register_user_use_case,
)
from .serializers import (
    AuthStatusSerializer,
    ErrorResponse,
    HTTPValidationError,
    LoginRequest,
    LoginResponse,
    RegisterUserRequest,
    RegisterUserResponse,
    ValidationErrorResponse,
)


class AuthOverviewView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    @extend_schema(
        tags=["auth"],
        operation_id="auth_module_status",
        responses=AuthStatusSerializer,
        description="Returns the current status of the authentication API module.",
    )
    def get(self, _request):
        payload = {
            "app": "auth",
            "status": "ready",
            "detail": "Authentication endpoints are served by Django REST Framework.",
        }
        return Response(AuthStatusSerializer(payload).data)


class RegisterUserView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    @extend_schema(
        tags=["auth"],
        operation_id="register_user_register_post",
        request=RegisterUserRequest,
        responses={
            201: RegisterUserResponse,
            400: ValidationErrorResponse,
            409: ErrorResponse,
            422: HTTPValidationError,
        },
    )
    def post(self, request):
        serializer = RegisterUserRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = get_register_user_use_case()
        result = use_case.execute(
            RegisterUserInput(
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
        )
        payload = {
            "id": result.id,
            "email": result.email,
            "created_at": result.created_at,
            "is_active": result.is_active,
        }
        return Response(
            RegisterUserResponse(payload).data,
            status=status.HTTP_201_CREATED,
        )


class LoginUserView(APIView):
    authentication_classes: list[type] = []
    permission_classes: list[type] = []

    @extend_schema(
        tags=["auth"],
        operation_id="login_user_login_post",
        request=LoginRequest,
        responses={
            200: LoginResponse,
            401: ErrorResponse,
            422: HTTPValidationError,
        },
    )
    def post(self, request):
        serializer = LoginRequest(data=request.data)
        serializer.is_valid(raise_exception=True)

        use_case = get_authenticate_user_use_case()
        result = use_case.execute(
            AuthenticateUserInput(
                email=serializer.validated_data["email"],
                password=serializer.validated_data["password"],
            )
        )
        payload = {
            "access_token": result.access_token,
            "token_type": result.token_type,
            "email": result.email,
        }
        return Response(LoginResponse(payload).data)


class LogoutUserView(AuthenticatedAPIView):

    @extend_schema(
        tags=["auth"],
        operation_id="logout_user_logout_post",
        request=None,
        responses={
            204: None,
            401: ErrorResponse,
        },
        description="Revokes the current authenticated session.",
    )
    def post(self, request):
        auth_context = request.auth
        if not isinstance(auth_context, JwtAuthContext):
            raise TypeError("request.auth must be a JwtAuthContext")
        use_case = get_logout_use_case()
        use_case.execute(LogoutInput(session_id=auth_context.session_id))
        return Response(status=status.HTTP_204_NO_CONTENT)
