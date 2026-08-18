import pytest
import numpy as np
from backend.models.edge_extractor import extract_edge_features

def test_extract_edge_features():
    # Create 28x28 binary image with a white square in center
    img = np.zeros((28, 28), dtype=np.uint8)
    img[8:20, 8:20] = 255

    res = extract_edge_features(img)

    assert res["canny_edge_count"] > 0
    assert res["edge_density_percent"] > 0
    assert "canny_edge_map_base64" in res
    assert "sobel_magnitude_base64" in res
