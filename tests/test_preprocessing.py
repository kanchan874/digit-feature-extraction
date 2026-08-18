import pytest
import numpy as np
from backend.models.preprocessing import preprocess_digit_image

def test_preprocess_digit_image():
    # Create dummy 100x100 white image with a black square (digit-like structure)
    img = np.ones((100, 100), dtype=np.uint8) * 255
    img[20:80, 20:80] = 0

    result = preprocess_digit_image(img, target_size=(28, 28))
    
    assert "processed_array" in result
    assert result["processed_array"].shape == (28, 28)
    assert result["is_inverted"] is True
    assert result["preprocessed_image_base64"].startswith("data:image/png;base64,")
