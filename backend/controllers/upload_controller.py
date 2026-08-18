from fastapi import UploadFile
from backend.utils.validators import validate_image_file
from backend.controllers.feature_controller import process_and_extract_all_features
from typing import Dict, Any

async def handle_image_upload(file: UploadFile) -> Dict[str, Any]:
    """Validate uploaded file and process feature extraction."""
    validate_image_file(file)
    contents = await file.read()
    return process_and_extract_all_features(contents)
