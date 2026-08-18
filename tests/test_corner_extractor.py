import pytest
import numpy as np
from backend.models.corner_extractor import extract_corner_features

def test_extract_corner_features():
    # Create 28x28 binary image with an 'L' shape to produce clear corners
    img = np.zeros((28, 28), dtype=np.uint8)
    img[5:22, 5:10] = 255
    img[17:22, 5:22] = 255

    res = extract_corner_features(img)

    assert "harris_corner_count" in res
    assert "shi_tomasi_corner_count" in res
    assert "corner_map_base64" in res
    assert res["corner_map_base64"].startswith("data:image/png;base64,")
