"""Shared pytest configuration for the backend test suite."""

import os
from collections.abc import Generator

import django
import pytest
from django.test import Client

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from app.auth.presentation.dependencies import clear_dependency_overrides as clear_auth
from app.tasks.presentation.dependencies import (
    clear_dependency_overrides as clear_tasks,
)


@pytest.fixture
def client() -> Generator[Client, None, None]:
    """Provide a Django test client and clear dependency overrides afterwards."""

    yield Client()
    clear_auth()
    clear_tasks()
