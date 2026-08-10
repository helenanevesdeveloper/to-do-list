import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.environment import load_environment
from app.presentation.controllers.auth_controller import router as auth_router
from app.presentation.controllers.file_upload_controller import (
    router as file_upload_router,
)
from app.presentation.exception_handlers import add_exception_handlers

load_environment()

app = FastAPI()
allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)
add_exception_handlers(app)

app.include_router(auth_router)
app.include_router(file_upload_router)
