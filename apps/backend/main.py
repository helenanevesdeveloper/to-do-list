import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from config.asgi import application as app
