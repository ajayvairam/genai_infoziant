import os
from typing import List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env if present
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "DebugMate AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Gemini API Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # Security and CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Request limits
    MAX_REQUEST_SIZE_BYTES: int = 1_000_000  # ~1MB max payload

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

