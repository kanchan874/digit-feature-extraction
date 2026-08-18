import cv2
import numpy as np
from typing import Dict, Any
from backend.utils.image_utils import cv2_to_base64, colormap_to_base64

def extract_edge_features(binary_img: np.ndarray, low_threshold: int = 50, high_threshold: int = 150) -> Dict[str, Any]:
    """
    Perform edge detection using Canny & Sobel operators.
    Calculates edge metrics and returns visualization maps.
    """
    # Ensure binary format (0 or 255)
    img = binary_img.astype(np.uint8)

    # 1. Canny Edge Detection
    canny_edges = cv2.Canny(img, low_threshold, high_threshold)

    # 2. Sobel Edge Detection (Horizontal Gx & Vertical Gy)
    sobel_x = cv2.Sobel(img, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(img, cv2.CV_64F, 0, 1, ksize=3)

    # Gradient Magnitude & Direction (Orientation angle in degrees 0-180)
    magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
    direction = np.arctan2(np.abs(sobel_y), np.abs(sobel_x)) * (180.0 / np.pi)

    # Normalize magnitude for visualization (0-255)
    sobel_mag_uint8 = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    # Calculate Metrics
    total_pixels = img.size
    canny_edge_count = int(np.count_nonzero(canny_edges))
    edge_density = float(round((canny_edge_count / total_pixels) * 100, 2))

    # Sobel Edge Energy / Directional distribution
    horizontal_edges = int(np.count_nonzero(np.abs(sobel_y) > 50))
    vertical_edges = int(np.count_nonzero(np.abs(sobel_x) > 50))
    hv_ratio = float(round(horizontal_edges / (vertical_edges + 1e-5), 2))

    # Average gradient orientation for edge pixels
    edge_mask = canny_edges > 0
    mean_direction = float(round(np.mean(direction[edge_mask]), 2)) if np.any(edge_mask) else 0.0

    # Resize images for clear display
    display_size = (280, 280)
    canny_display = cv2.resize(canny_edges, display_size, interpolation=cv2.INTER_NEAREST)
    sobel_display = cv2.resize(sobel_mag_uint8, display_size, interpolation=cv2.INTER_NEAREST)

    return {
        "canny_edge_count": canny_edge_count,
        "edge_density_percent": edge_density,
        "horizontal_edge_pixels": horizontal_edges,
        "vertical_edge_pixels": vertical_edges,
        "hv_edge_ratio": hv_ratio,
        "mean_edge_angle_deg": mean_direction,
        "max_sobel_gradient": float(round(np.max(magnitude), 2)),
        "canny_edge_map_base64": cv2_to_base64(canny_display),
        "sobel_magnitude_base64": colormap_to_base64(sobel_display, cv2.COLORMAP_MAGMA)
    }
