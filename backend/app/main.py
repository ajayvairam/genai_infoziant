import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.endpoints import health, debug, dashboard

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("debugmate-api")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for DebugMate AI — Error Message Debugging Helper Using LLM",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request size limitation middleware
@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > settings.MAX_REQUEST_SIZE_BYTES:
        return JSONResponse(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            content={"detail": "Payload too large. Maximum supported input size is 1MB."}
        )
    return await call_next(request)

# Include API Routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(debug.router, prefix="/api/debug", tags=["Debugging"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to DebugMate AI API",
        "documentation": "/api/docs",
        "health": "/api/health"
    }

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up DebugMate AI backend...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Gemini API key configured: {'YES' if settings.GEMINI_API_KEY else 'NO (Set GEMINI_API_KEY in .env)'}")
    logger.info(f"Supabase configured: {'YES' if (settings.SUPABASE_URL and settings.SUPABASE_KEY) else 'NO (Local fallback active)'}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down DebugMate AI backend.")
