import PyPDF2
import re
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def read_property_pdf(pdf_path):
    if not os.path.exists(pdf_path):
        return {"error": "PDF file nahi mili"}

    text = ""
    
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text()

    # Property details extract karo
    details = {}

    # Price dhundho
    price_match = re.search(r'(price|rent|kiraya|qeemat)[\s:]*(\d[\d,]*)', text, re.IGNORECASE)
    if price_match:
        details["price"] = price_match.group(2)

    # Location dhundho
    cities = ["lahore", "karachi", "islamabad", "rawalpindi", "multan", "peshawar"]
    for city in cities:
        if city in text.lower():
            details["location"] = city.capitalize()
            break

    # Bedrooms dhundho
    bed_match = re.search(r'(\d+)\s*(bedroom|bed room|kamra|kamray)', text, re.IGNORECASE)
    if bed_match:
        details["bedrooms"] = bed_match.group(1)

    # Area dhundho
    area_match = re.search(r'(\d+)\s*(marla|kanal|sqft|square feet)', text, re.IGNORECASE)
    if area_match:
        details["area"] = area_match.group(1) + " " + area_match.group(2)

    return {
        "raw_text": text[:500],
        "extracted_details": details,
        "summary": f"PDF mein property details: {details}"
    }

if __name__ == "__main__":
    pdf_path = "test_property.pdf"
    
    if os.path.exists(pdf_path):
        result = read_property_pdf(pdf_path)
        print("PDF Analysis:")
        for key, value in result.items():
            print(f"{key}: {value}")
    else:
        print("test_property.pdf file rakho ai-model folder mein aur dobara chalao!")