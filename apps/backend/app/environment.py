from pathlib import Path

from dotenv import load_dotenv

_ENV_LOADED = False


def load_environment() -> None:
    global _ENV_LOADED
    if _ENV_LOADED:
        return

    project_root = Path(__file__).resolve().parent.parent
    for env_path in (project_root / ".env", project_root / ".env.local"):
        if env_path.is_file():
            load_dotenv(dotenv_path=env_path, override=False)

    _ENV_LOADED = True
