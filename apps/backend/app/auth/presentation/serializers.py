from rest_framework import serializers


class RegisterUserRequest(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class LoginRequest(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class LoginResponse(serializers.Serializer):
    access_token = serializers.CharField()
    token_type = serializers.CharField()


class RegisterUserResponse(serializers.Serializer):
    id = serializers.CharField()
    email = serializers.CharField()
    created_at = serializers.CharField()
    is_active = serializers.BooleanField()


class ErrorResponse(serializers.Serializer):
    detail = serializers.CharField()


class ValidationIssueResponse(serializers.Serializer):
    field = serializers.CharField()
    message = serializers.CharField()


class ValidationErrorResponse(serializers.Serializer):
    detail = ValidationIssueResponse(many=True)


class HTTPValidationErrorItem(serializers.Serializer):
    loc = serializers.ListField(child=serializers.CharField())
    msg = serializers.CharField()
    type = serializers.CharField()


class HTTPValidationError(serializers.Serializer):
    detail = HTTPValidationErrorItem(many=True)


class AuthStatusSerializer(serializers.Serializer):
    app = serializers.CharField()
    status = serializers.CharField()
    detail = serializers.CharField()
