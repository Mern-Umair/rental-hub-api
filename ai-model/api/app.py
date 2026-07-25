from flask import Flask, request, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.predict import predict_with_suggestions
from src.rag_agent import rag_response, search_properties
from src.image_analyzer import analyze_property_image
from src.pdf_reader import read_property_pdf

app = Flask(__name__)

# Health check
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "Property AI API chal rahi hai!"
    })

# Chat endpoint
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")
    
    if not message:
        return jsonify({"success": False, "message": "Message required"}), 400
    
    result = predict_with_suggestions(message)
    
    return jsonify({
        "success": True,
        "response": result["response"],
        "suggestions": result["suggestions"]
    })

# RAG search endpoint
@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    query = data.get("query", "")
    
    if not query:
        return jsonify({"success": False, "message": "Query required"}), 400
    
    results = search_properties(query)
    response = rag_response(query)
    
    return jsonify({
        "success": True,
        "query": query,
        "response": response,
        "properties": results
    })

# Image analyze endpoint
@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    data = request.get_json()
    image_path = data.get("image_path", "")
    
    if not image_path:
        return jsonify({"success": False, "message": "Image path required"}), 400
    
    result = analyze_property_image(image_path)
    
    return jsonify({
        "success": True,
        "analysis": result
    })

# PDF read endpoint
@app.route("/read-pdf", methods=["POST"])
def read_pdf():
    data = request.get_json()
    pdf_path = data.get("pdf_path", "")
    
    if not pdf_path:
        return jsonify({"success": False, "message": "PDF path required"}), 400
    
    result = read_property_pdf(pdf_path)
    
    return jsonify({
        "success": True,
        "data": result
    })

if __name__ == "__main__":
    app.run(port=5001, debug=True)