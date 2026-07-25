import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Embedding model load karo
model = SentenceTransformer('all-MiniLM-L6-v2')

# Property database — hamare project ka data
properties = [
    {"id": 1, "title": "2 Bedroom Flat Lahore DHA", "location": "Lahore", "area": "DHA", "price": 25000, "bedrooms": 2, "type": "flat"},
    {"id": 2, "title": "3 Bedroom House Karachi", "location": "Karachi", "area": "Gulshan", "price": 35000, "bedrooms": 3, "type": "house"},
    {"id": 3, "title": "1 Bedroom Flat Islamabad", "location": "Islamabad", "area": "F-10", "price": 15000, "bedrooms": 1, "type": "flat"},
    {"id": 4, "title": "4 Bedroom Villa Lahore", "location": "Lahore", "area": "Gulberg", "price": 80000, "bedrooms": 4, "type": "villa"},
    {"id": 5, "title": "2 Bedroom Flat Rawalpindi", "location": "Rawalpindi", "area": "Saddar", "price": 18000, "bedrooms": 2, "type": "flat"},
    {"id": 6, "title": "3 Bedroom House Lahore", "location": "Lahore", "area": "Model Town", "price": 45000, "bedrooms": 3, "type": "house"},
    {"id": 7, "title": "Studio Flat Karachi", "location": "Karachi", "area": "Clifton", "price": 12000, "bedrooms": 1, "type": "flat"},
    {"id": 8, "title": "5 Bedroom Bungalow Lahore", "location": "Lahore", "area": "DHA Phase 6", "price": 150000, "bedrooms": 5, "type": "bungalow"},
]

# Properties ko text mein convert karo
property_texts = [
    f"{p['title']} in {p['area']} {p['location']} - {p['bedrooms']} bedroom - Rent {p['price']} - Type {p['type']}"
    for p in properties
]

# Embeddings banao
print("Embeddings ban rahi hain...")
embeddings = model.encode(property_texts)
embeddings = np.array(embeddings).astype('float32')

# FAISS index banao
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)
print("RAG ready hai!")

def search_properties(query, top_k=3):
    query_embedding = model.encode([query]).astype('float32')
    distances, indices = index.search(query_embedding, top_k)
    
    results = []
    for i, idx in enumerate(indices[0]):
        prop = properties[idx]
        results.append({
            "property": prop,
            "score": round(float(distances[0][i]), 2)
        })
    
    return results

def rag_response(query):
    results = search_properties(query)
    
    response = f"Aapki query '{query}' ke liye {len(results)} properties mili hain:\n"
    
    for i, result in enumerate(results):
        prop = result["property"]
        response += f"\n{i+1}. {prop['title']}"
        response += f"\n   Location: {prop['area']}, {prop['location']}"
        response += f"\n   Rent: {prop['price']} per month"
        response += f"\n   Bedrooms: {prop['bedrooms']}"
        response += f"\n   Type: {prop['type']}\n"
    
    return response

if __name__ == "__main__":
    print(rag_response("lahore mein 2 bedroom flat chahiye"))
    print("---")
    print(rag_response("sasta ghar karachi mein"))
    print("---")
    print(rag_response("DHA villa"))