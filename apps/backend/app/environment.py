from pathlib import Path

from dotenv import load_dotenv

_ENV_LOADED = False


def load_environment() -> None:
    global _ENV_LOADED
    if _ENV_LOADED:
        return

    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.is_file():
        load_dotenv(dotenv_path=env_path, override=False)

    _ENV_LOADED = True
