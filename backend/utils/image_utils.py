import base64
import io
import cv2
import numpy as np
from PIL import Image

def bytes_to_cv2(image_bytes: bytes) -> np.ndarray:
    """Convert raw image bytes to an OpenCV BGR/Grayscale image array."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError("Invalid image file or format")
    return img

def cv2_to_base64(img: np.ndarray, format: str = "png") -> str:
    """Convert an OpenCV image (numpy array) to a Base64 data URI string."""
    if len(img.shape) == 2: # Grayscale
        success, encoded_img = cv2.imencode(f".{format}", img)
    else:
        success, encoded_img = cv2.imencode(f".{format}", img)
    
    if not success:
        raise ValueError("Failed to encode image to base64")
        
    base64_str = base64.b64encode(encoded_img).decode("utf-8")
    return f"data:image/{format};base64,{base64_str}"

def base64_to_cv2(base64_str: str) -> np.ndarray:
    """Convert a Base64 string back into an OpenCV image array."""
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]
    image_bytes = base64.b64decode(base64_str)
    return bytes_to_cv2(image_bytes)

def colormap_to_base64(img_gray: np.ndarray, colormap=cv2.COLORMAP_JET) -> str:
    """Apply an OpenCV colormap to a grayscale image and return base64 URI."""
    color_img = cv2.applyColorMap(img_gray, colormap)
    return cv2_to_base64(color_img)
