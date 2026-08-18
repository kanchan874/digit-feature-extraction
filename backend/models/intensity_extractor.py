import cv2
import numpy as np
from typing import Dict, Any, List

def extract_intensity_features(binary_28: np.ndarray, full_gray: np.ndarray = None) -> Dict[str, Any]:
    """
    Extract pixel intensity distribution, statistical metrics, center of mass,
    horizontal & vertical projection profiles, and structural shape descriptors.
    """
    img = binary_28.astype(np.uint8)
    
    # 1. Pixel Intensity Statistics
    pixels = img.flatten()
    mean_intensity = float(round(np.mean(pixels), 2))
    std_intensity = float(round(np.std(pixels), 2))
    min_intensity = int(np.min(pixels))
    max_intensity = int(np.max(pixels))
    non_zero_count = int(np.count_nonzero(img))
    total_pixels = img.size
    stroke_fill_ratio = float(round((non_zero_count / total_pixels) * 100, 2))

    # 2. Intensity Histogram (16 binned intervals for clear charts)
    hist, bin_edges = np.histogram(pixels, bins=16, range=(0, 256))
    histogram_bins: List[Dict[str, Any]] = []
    for i in range(len(hist)):
        bin_label = f"{int(bin_edges[i])}-{int(bin_edges[i+1])-1}"
        histogram_bins.append({
            "bin": bin_label,
            "count": int(hist[i]),
            "range_start": int(bin_edges[i]),
            "range_end": int(bin_edges[i+1])
        })

    # 3. Center of Mass / Centroid (using image moments)
    moments = cv2.moments(img)
    if moments["m00"] != 0:
        cx = float(round(moments["m10"] / moments["m00"], 2))
        cy = float(round(moments["m01"] / moments["m00"], 2))
    else:
        cx, cy = 14.0, 14.0

    # 4. Horizontal Projection (row sums) and Vertical Projection (column sums)
    horizontal_projection = [int(val) for val in np.sum(img, axis=1)]
    vertical_projection = [int(val) for val in np.sum(img, axis=0)]

    # 5. Structural Contour Descriptors (Area, Bounding Box, Aspect Ratio, Solidity)
    contours, _ = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    area = 0.0
    perimeter = 0.0
    aspect_ratio = 1.0
    solidity = 1.0

    if contours:
        # Get largest contour (digit shape)
        c = max(contours, key=cv2.contourArea)
        area = float(round(cv2.contourArea(c), 2))
        perimeter = float(round(cv2.arcLength(c, True), 2))

        x, y, w, h = cv2.boundingRect(c)
        aspect_ratio = float(round(w / (h + 1e-5), 2))

        hull = cv2.convexHull(c)
        hull_area = cv2.contourArea(hull)
        if hull_area > 0:
            solidity = float(round(area / hull_area, 2))

    return {
        "mean_intensity": mean_intensity,
        "std_intensity": std_intensity,
        "min_intensity": min_intensity,
        "max_intensity": max_intensity,
        "active_stroke_pixels": non_zero_count,
        "stroke_fill_ratio_percent": stroke_fill_ratio,
        "centroid_x": cx,
        "centroid_y": cy,
        "histogram_16_bins": histogram_bins,
        "horizontal_projection": horizontal_projection, # 28 elements
        "vertical_projection": vertical_projection,     # 28 elements
        "contour_area": area,
        "contour_perimeter": perimeter,
        "bounding_box_aspect_ratio": aspect_ratio,
        "solidity": solidity
    }
