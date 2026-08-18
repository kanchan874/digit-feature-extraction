import cv2
import numpy as np
from typing import Dict, Any, List
from backend.utils.image_utils import cv2_to_base64

def extract_corner_features(
    binary_img: np.ndarray,
    harris_blockSize: int = 2,
    harris_ksize: int = 3,
    harris_k: float = 0.04,
    max_corners: int = 25,
    quality_level: float = 0.1,
    min_distance: float = 3.0
) -> Dict[str, Any]:
    """
    Extract Harris & Shi-Tomasi corner points from binary digit image.
    Renders keypoints on a colorful output image and returns coordinate metrics.
    """
    img = binary_img.astype(np.uint8)
    h, w = img.shape

    # Convert grayscale binary to 3-channel BGR for drawing colored keypoint circles
    overlay = cv2.cvtColor(cv2.resize(img, (280, 280), interpolation=cv2.INTER_NEAREST), cv2.COLOR_GRAY2BGR)

    # 1. Harris Corner Detection
    # Calculate Harris response matrix R
    img_float = np.float32(img)
    harris_response = cv2.cornerHarris(img_float, harris_blockSize, harris_ksize, harris_k)
    harris_response = cv2.dilate(harris_response, None)

    # Threshold Harris response to identify corners
    threshold = 0.01 * harris_response.max() if harris_response.max() > 0 else 0
    harris_corners_mask = harris_response > threshold
    harris_coords = np.argwhere(harris_corners_mask)  # Array of [y, x]
    
    # Scale coordinates to display image (280x280)
    scale_x = 280.0 / w
    scale_y = 280.0 / h

    harris_points: List[List[int]] = []
    for y, x in harris_coords:
        harris_points.append([int(x), int(y)])
        cx, cy = int((x + 0.5) * scale_x), int((y + 0.5) * scale_y)
        # Draw Harris corners as bright cyan rings
        cv2.circle(overlay, (cx, cy), 4, (255, 255, 0), 1)

    # 2. Shi-Tomasi Corner Detection (goodFeaturesToTrack)
    shi_tomasi_corners = cv2.goodFeaturesToTrack(
        img,
        maxCorners=max_corners,
        qualityLevel=quality_level,
        minDistance=min_distance
    )

    shi_tomasi_points: List[List[int]] = []
    if shi_tomasi_corners is not None:
        for pt in shi_tomasi_corners:
            x, y = pt[0]
            shi_tomasi_points.append([int(x), int(y)])
            cx, cy = int((x + 0.5) * scale_x), int((y + 0.5) * scale_y)
            # Draw Shi-Tomasi corners as solid red circles
            cv2.circle(overlay, (cx, cy), 3, (0, 0, 255), -1)

    return {
        "harris_corner_count": len(harris_points),
        "shi_tomasi_corner_count": len(shi_tomasi_points),
        "harris_max_response": float(round(float(harris_response.max()), 4)) if harris_response.size > 0 else 0.0,
        "harris_points": harris_points,             # [[x, y], ...]
        "shi_tomasi_points": shi_tomasi_points,     # [[x, y], ...]
        "corner_map_base64": cv2_to_base64(overlay)
    }
