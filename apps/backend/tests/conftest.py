"""Shared pytest configuration for the backend test suite."""

import os
from collections.abc import Generator

import django
import pytest
from django.test import Client

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()


@pytest.fixture
def client() -> Generator[Client, None, None]:
    """Provide a Django test client."""

    yield Client()
