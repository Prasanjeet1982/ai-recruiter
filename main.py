import uvicorn
import os
import sys

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print("=" * 60)
    print("Starting InterviewIQ Platform - Enterprise AI Interview System")
    print("Technology: Python 3.x + FastAPI + Pydantic + Uvicorn")
    print(f"Web UI:      http://localhost:{port}")
    print(f"Swagger API: http://localhost:{port}/docs")
    print("=" * 60)
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
