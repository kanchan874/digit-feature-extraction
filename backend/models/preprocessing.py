import cv2
import numpy as np
from typing import Dict, Any, Tuple
from backend.utils.image_utils import cv2_to_base64

def preprocess_digit_image(img: np.ndarray, target_size: Tuple[int, int] = (28, 28)) -> Dict[str, Any]:
    """
    Preprocess raw digit image:
    1. Grayscale conversion
    2. Auto background invert (ensure white digit on black background)
    3. Gaussian blur denoising
    4. Otsu binarization
    5. Resize to target (e.g. 28x28)
    """
    # 1. Grayscale conversion
    if len(img.shape) == 3:
        if img.shape[2] == 4: # RGBA
            # Blend alpha channel onto white background
            alpha = img[:, :, 3] / 255.0
            gray = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY)
            gray = (gray * alpha + 255 * (1 - alpha)).astype(np.uint8)
        else:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img.copy()

    orig_height, orig_width = gray.shape

    # 2. Check if background is bright (white) and invert if necessary
    # If corners/border are bright on average, assume light background
    border_pixels = np.concatenate([
        gray[0, :], gray[-1, :], gray[:, 0], gray[:, -1]
    ])
    if np.mean(border_pixels) > 127:
        gray = cv2.bitwise_not(gray)

    # 3. Denoising
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)

    # 4. Otsu's Thresholding (Binarization)
    _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # 5. Resize to target standard size (28x28)
    resized_28 = cv2.resize(binary, target_size, interpolation=cv2.INTER_AREA)

    # 6. Resize to larger view for clean visualization (e.g. 280x280)
    display_img = cv2.resize(binary, (280, 280), interpolation=cv2.INTER_NEAREST)

    return {
        "processed_array": resized_28,         # 28x28 binary numpy array
        "binary_full": binary,                # full resolution binary numpy array
        "gray_full": gray,                    # full resolution grayscale
        "orig_shape": (orig_width, orig_height),
        "target_size": target_size,
        "preprocessed_image_base64": cv2_to_base64(display_img),
        "is_inverted": bool(np.mean(border_pixels) > 127)
    }
