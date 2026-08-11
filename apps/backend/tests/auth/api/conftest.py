import pytest
from django.test import Client

from app.auth.presentation.dependencies import clear_dependency_overrides


@pytest.fixture
def client() -> Client:
    yield Client()
    clear_dependency_overrides()
