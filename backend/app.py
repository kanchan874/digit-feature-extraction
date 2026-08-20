import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.routes.api_routes import router as api_router

app = FastAPI(
    title="Handwritten Digit Feature Extraction API",
    description="Computer Vision API for extracting edges, corners, intensity histograms, and morphological features from digit images.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow local React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static sample images & uploads (safe for serverless)
try:
    static_dir = os.path.abspath("backend/static")
    os.makedirs(os.path.join(static_dir, "samples"), exist_ok=True)
    os.makedirs(os.path.join(static_dir, "uploads"), exist_ok=True)
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
except Exception as err:
    print(f"Static directory mounting skipped for serverless: {err}")

# Register API routes
app.include_router(api_router)

@app.get("/")
def read_root():
    return {
        "message": "Handwritten Digit Feature Extraction API is operational",
        "docs": "/docs",
        "routes": ["/api/extract-features", "/api/extract-features-base64", "/api/sample-images"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=True)
