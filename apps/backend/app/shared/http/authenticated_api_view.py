"""Shared DRF base view for JWT-protected endpoints."""

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from app.auth.presentation.drf_authentication import JwtAuthentication


class AuthenticatedAPIView(APIView):
    """Base DRF view for endpoints protected by the app JWT."""

    authentication_classes = [JwtAuthentication]
    permission_classes = [IsAuthenticated]
