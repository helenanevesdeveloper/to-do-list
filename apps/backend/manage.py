#!/usr/bin/env python
"""Django management entrypoint for local development and tooling."""

import os
import sys

from django.core.management import (  # type: ignore[import-untyped]
    execute_from_command_line,
)


def main() -> None:
    """Run Django management commands using the configured settings module."""
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
