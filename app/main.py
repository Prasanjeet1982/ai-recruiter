import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import STATIC_DIR
from app.routers.api import router as api_router

app = FastAPI(
    title="InterviewIQ™ Platform API",
    description="Enterprise AI-Powered Interview Management System - Python Backend (POC)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Endpoints
app.include_router(api_router)

# Mount Static Files (HTML/CSS/JS)
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

@app.get("/")
def serve_index():
    index_file = STATIC_DIR / "index.html"
    if os.path.exists(index_file):
        return FileResponse(str(index_file))
    return {"message": "AI Interview Platform API is running. Visit /docs for Swagger UI."}
