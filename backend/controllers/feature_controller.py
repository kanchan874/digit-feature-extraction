from typing import Dict, Any
import numpy as np
from backend.models.preprocessing import preprocess_digit_image
from backend.models.edge_extractor import extract_edge_features
from backend.models.corner_extractor import extract_corner_features
from backend.models.intensity_extractor import extract_intensity_features
from backend.utils.image_utils import bytes_to_cv2, base64_to_cv2, cv2_to_base64
import cv2

def process_and_extract_all_features(image_input: Any) -> Dict[str, Any]:
    """
    Controller function:
    Receives raw image bytes, numpy array, or base64 string.
    Calls preprocessing -> edge -> corner -> intensity extractors.
    Returns consolidated JSON dictionary payload for frontend.
    """
    # 1. Convert input to OpenCV numpy array
    if isinstance(image_input, bytes):
        img = bytes_to_cv2(image_input)
    elif isinstance(image_input, str):
        img = base64_to_cv2(image_input)
    elif isinstance(image_input, np.ndarray):
        img = image_input
    else:
        raise ValueError("Unsupported image input type")

    # Original Image Base64 for display
    if len(img.shape) == 2:
        orig_color = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    else:
        orig_color = img.copy()
    
    orig_display = cv2.resize(orig_color, (280, 280), interpolation=cv2.INTER_NEAREST)
    original_base64 = cv2_to_base64(orig_display)

    # 2. Preprocessing
    preprocessed = preprocess_digit_image(img, target_size=(28, 28))
    binary_28 = preprocessed["processed_array"]
    binary_full = preprocessed["binary_full"]

    # 3. Feature Extraction
    edge_results = extract_edge_features(binary_28)
    corner_results = extract_corner_features(binary_28)
    intensity_results = extract_intensity_features(binary_28, preprocessed["gray_full"])

    # 4. Return complete feature bundle
    return {
        "status": "success",
        "metadata": {
            "original_width": preprocessed["orig_shape"][0],
            "original_height": preprocessed["orig_shape"][1],
            "target_size": "28x28",
            "is_inverted": preprocessed["is_inverted"]
        },
        "images": {
            "original_base64": original_base64,
            "preprocessed_base64": preprocessed["preprocessed_image_base64"],
            "canny_edge_map_base64": edge_results["canny_edge_map_base64"],
            "sobel_magnitude_base64": edge_results["sobel_magnitude_base64"],
            "corner_map_base64": corner_results["corner_map_base64"]
        },
        "edges": {
            "canny_edge_count": edge_results["canny_edge_count"],
            "edge_density_percent": edge_results["edge_density_percent"],
            "horizontal_edge_pixels": edge_results["horizontal_edge_pixels"],
            "vertical_edge_pixels": edge_results["vertical_edge_pixels"],
            "hv_edge_ratio": edge_results["hv_edge_ratio"],
            "mean_edge_angle_deg": edge_results["mean_edge_angle_deg"],
            "max_sobel_gradient": edge_results["max_sobel_gradient"]
        },
        "corners": {
            "harris_corner_count": corner_results["harris_corner_count"],
            "shi_tomasi_corner_count": corner_results["shi_tomasi_corner_count"],
            "harris_max_response": corner_results["harris_max_response"],
            "harris_points": corner_results["harris_points"],
            "shi_tomasi_points": corner_results["shi_tomasi_points"]
        },
        "intensity": {
            "mean_intensity": intensity_results["mean_intensity"],
            "std_intensity": intensity_results["std_intensity"],
            "min_intensity": intensity_results["min_intensity"],
            "max_intensity": intensity_results["max_intensity"],
            "active_stroke_pixels": intensity_results["active_stroke_pixels"],
            "stroke_fill_ratio_percent": intensity_results["stroke_fill_ratio_percent"],
            "centroid": {
                "x": intensity_results["centroid_x"],
                "y": intensity_results["centroid_y"]
            },
            "histogram_16_bins": intensity_results["histogram_16_bins"],
            "horizontal_projection": intensity_results["horizontal_projection"],
            "vertical_projection": intensity_results["vertical_projection"]
        },
        "structure": {
            "contour_area": intensity_results["contour_area"],
            "contour_perimeter": intensity_results["contour_perimeter"],
            "bounding_box_aspect_ratio": intensity_results["bounding_box_aspect_ratio"],
            "solidity": intensity_results["solidity"]
        }
    }
