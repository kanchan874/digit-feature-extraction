import pytest
import numpy as np
from backend.models.intensity_extractor import extract_intensity_features

def test_extract_intensity_features():
    img = np.zeros((28, 28), dtype=np.uint8)
    img[10:20, 10:20] = 255

    res = extract_intensity_features(img)

    assert res["mean_intensity"] > 0
    assert res["active_stroke_pixels"] == 100
    assert len(res["histogram_16_bins"]) == 16
    assert len(res["horizontal_projection"]) == 28
    assert len(res["vertical_projection"]) == 28
    assert "centroid_x" in res
    assert "centroid_y" in res
