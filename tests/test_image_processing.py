import cv2
import numpy as np
from PIL import Image
import os

def test_image():
    # 1. Create a dummy image using numpy/opencv
    img_data = np.zeros((300, 400, 3), dtype=np.uint8)
    # Fill with a color (e.g., teal)
    img_data[:] = (128, 128, 0)
    
    test_path = "assets/test_sample.png"
    cv2.imwrite(test_path, img_data)
    print(f"✓ Created test image at {test_path}")
    
    # 2. Open using PIL
    pil_img = Image.open(test_path)
    width, height = pil_img.size
    mode = pil_img.mode
    print(f"PIL Image Info -> Width: {width}, Height: {height}, Mode: {mode}")
    pil_img.close()
    
    # 3. Read using OpenCV
    cv_img = cv2.imread(test_path)
    h, w, c = cv_img.shape
    print(f"OpenCV Image Info -> Width: {w}, Height: {h}, Channels: {c}")
    
    # Verify dimensions
    assert width == 400 and height == 300
    assert w == 400 and h == 300
    print("✓ Image processing verification PASSED successfully!")

if __name__ == "__main__":
    test_image()
