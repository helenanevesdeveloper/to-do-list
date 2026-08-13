from django.db import models
from django.utils import timezone


class UserModel(models.Model):
    id = models.TextField(primary_key=True)
    email = models.CharField(max_length=320, unique=True)
    password_hash = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = "users"


class AuthSessionModel(models.Model):
    id = models.TextField(primary_key=True)
    user = models.ForeignKey(
        UserModel,
        on_delete=models.CASCADE,
        db_column="user_id",
        related_name="auth_sessions",
    )
    created_at = models.DateTimeField()
    expires_at = models.DateTimeField()
    revoked_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "auth_sessions"
        indexes = [
            models.Index(
                fields=["user"],
                name="idx_auth_sessions_user_id",
            ),
            models.Index(
                fields=["revoked_at"],
                name="idx_auth_sessions_revoked_at",
            ),
        ]
