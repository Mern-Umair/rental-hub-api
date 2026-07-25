import cv2
import numpy as np
from PIL import Image
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def analyze_property_image(image_path):
    img = cv2.imread(image_path)
    
    if img is None:
        return {"error": "Image load nahi hui"}
    
    # Image size
    height, width = img.shape[:2]
    
    # Colors analyze karo
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Brightness check
    brightness = np.mean(img)
    
    # Room detect karo colors se
    features = []
    
    if brightness > 150:
        features.append("Roshan kamra")
    else:
        features.append("Kam roshni wala kamra")
    
    # Green detect karo — garden
    green_mask = cv2.inRange(hsv, np.array([35, 40, 40]), np.array([85, 255, 255]))
    green_percent = np.sum(green_mask > 0) / (height * width) * 100
    
    if green_percent > 10:
        features.append("Garden ya lawn available")
    
    # Blue detect karo — sky/pool
    blue_mask = cv2.inRange(hsv, np.array([100, 40, 40]), np.array([130, 255, 255]))
    blue_percent = np.sum(blue_mask > 0) / (height * width) * 100
    
    if blue_percent > 5:
        features.append("Swimming pool ya khula aasman")
    
    # Size estimate
    if width > 1000:
        features.append("Bari jagah — villa ya bungalow")
    else:
        features.append("Chhoti ya medium jagah — flat ya apartment")
    
    result = {
        "image_size": f"{width}x{height}",
        "brightness": round(brightness, 2),
        "features": features,
        "summary": "Property mein " + ", ".join(features)
    }
    
    return result

if __name__ == "__main__":
    # Test image
    test_image = "test_property.jpg"
    
    if os.path.exists(test_image):
        result = analyze_property_image(test_image)
        print("Image Analysis:")
        for key, value in result.items():
            print(f"{key}: {value}")
    else:
        print("test_property.jpg file rakho ai-model folder mein aur dobara chalao!")