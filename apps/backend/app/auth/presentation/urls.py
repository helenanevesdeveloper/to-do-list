from django.urls import path

from .views import (
    AuthOverviewView,
    LoginUserView,
    LogoutUserView,
    RegisterUserView,
)

urlpatterns = [
    path("", AuthOverviewView.as_view(), name="auth-overview"),
    path("register", RegisterUserView.as_view(), name="register"),
    path("login", LoginUserView.as_view(), name="login"),
    path("logout", LogoutUserView.as_view(), name="logout"),
]
