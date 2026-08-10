from pydantic import BaseModel, EmailStr


class RegisterUserRequest(BaseModel):
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str


class RegisterUserResponse(BaseModel):
    id: str
    email: str
    created_at: str
    is_active: bool


class ErrorResponse(BaseModel):
    detail: str


class ValidationIssueResponse(BaseModel):
    field: str
    message: str


class ValidationErrorResponse(BaseModel):
    detail: list[ValidationIssueResponse]
