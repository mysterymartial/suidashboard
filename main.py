# main.py - FastAPI Application Entry Point
import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analyzer_router
from app.core.config import settings
from app.core.database import init_db
from app.core.rate_limter import RateLimiter

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("🚀 Starting Sui Tax Analysis API")
    await init_db()
    logger.info("✅ Database initialized")
    yield
    logger.info("🛑 Shutting down Sui Tax Analysis API")

app = FastAPI(
    title="Sui Blockchain Tax Analysis API",
    description="Complete Sui transaction analysis with AI-powered insights and tax calculations",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


rate_limiter = RateLimiter()


app.include_router(
    analyzer_router,
    prefix="/api/v1",
    tags=["analysis"],
    dependencies=[Depends(rate_limiter.check_rate_limit)]
)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Sui Blockchain Tax Analysis API",
        "version": "2.0.0",
        "features": [
            "AI-powered transaction analysis",
            "Real-time tax calculations",
            "Complete transaction history",
            "Multi-network support (mainnet/testnet/devnet)",
            "Batch processing with async optimization"
        ],
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2025-01-01T00:00:00Z",
        "version": "2.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
