import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
INSTANCE_DIR = BASE_DIR / "instance"
UPLOAD_FOLDER = BASE_DIR / "static" / "uploads"

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-d18bd7a1ea554c679a3b4b4f55ecfe29")
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{INSTANCE_DIR / 'informate.sqlite'}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = str(UPLOAD_FOLDER)
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'png','jpg','jpeg','webp','gif'}