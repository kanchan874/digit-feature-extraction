import os
import cv2
import numpy as np

def generate_mnist_samples(output_dirs):
    for d in output_dirs:
        os.makedirs(d, exist_ok=True)

    # Simple handwritten-style digits using OpenCV rendering
    for digit in range(10):
        # Create 112x112 image with black background
        img = np.zeros((112, 112), dtype=np.uint8)
        text = str(digit)

        # Scale and position for handwritten digit feel
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 3.2
        thickness = 7
        
        # Get text size
        (text_width, text_height), baseline = cv2.getTextSize(text, font, font_scale, thickness)
        x = (112 - text_width) // 2
        y = (112 + text_height) // 2 - 5

        cv2.putText(img, text, (x, y), font, font_scale, 255, thickness, cv2.LINE_AA)
        
        # Apply slight Gaussian blur to smooth stroke
        img = cv2.GaussianBlur(img, (3, 3), 0)

        # Save images
        for d in output_dirs:
            filepath = os.path.join(d, f"digit_{digit}.png")
            cv2.imwrite(filepath, img)
            print(f"Generated: {filepath}")

if __name__ == "__main__":
    dirs = [
        os.path.abspath("dataset/mnist_samples"),
        os.path.abspath("backend/static/samples")
    ]
    generate_mnist_samples(dirs)
