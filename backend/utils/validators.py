from fastapi import HTTPException, UploadFile

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "bmp", "webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def validate_image_file(file: UploadFile) -> None:
    """Validate uploaded file type and size."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename cannot be empty")
        
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file extension '.{ext}'. Allowed extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )
