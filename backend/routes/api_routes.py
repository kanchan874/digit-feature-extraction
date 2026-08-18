import os
import cv2
from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

from backend.controllers.upload_controller import handle_image_upload
from backend.controllers.feature_controller import process_and_extract_all_features

router = APIRouter(prefix="/api", tags=["features"])

class Base64ImageRequest(BaseModel):
    image_base64: str

@router.post("/extract-features")
async def extract_features_file(file: UploadFile = File(...)):
    """Upload an image file (PNG/JPG) to extract features."""
    return await handle_image_upload(file)

@router.post("/extract-features-base64")
async def extract_features_base64(req: Base64ImageRequest):
    """Send a base64 encoded image string (e.g. drawn from canvas) to extract features."""
    if not req.image_base64:
        raise HTTPException(status_code=400, detail="Base64 image string is required")
    try:
        return process_and_extract_all_features(req.image_base64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process canvas image: {str(e)}")

@router.get("/sample-images")
async def get_sample_images():
    """List available digit samples (0-9)."""
    samples_dir = os.path.abspath("backend/static/samples")
    if not os.path.exists(samples_dir):
        return {"samples": []}
    
    samples = []
    for digit in range(10):
        filename = f"digit_{digit}.png"
        if os.path.exists(os.path.join(samples_dir, filename)):
            samples.append({
                "digit": digit,
                "filename": filename,
                "url": f"/static/samples/{filename}"
            })
    return {"samples": samples}

@router.get("/sample-images/{digit}")
async def extract_sample_digit_features(digit: int):
    """Extract features for a built-in sample digit (0-9)."""
    if digit < 0 or digit > 9:
        raise HTTPException(status_code=404, detail="Digit sample must be between 0 and 9")
        
    sample_path = os.path.abspath(f"backend/static/samples/digit_{digit}.png")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail=f"Sample for digit {digit} not found")

    img = cv2.imread(sample_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise HTTPException(status_code=500, detail="Failed to load sample image")

    return process_and_extract_all_features(img)
