import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import mysql.connector
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

model = SentenceTransformer('all-MiniLM-L6-v2')

def get_properties_from_db():
    try:
        conn = mysql.connector.connect(
            host='127.0.0.1',
            user='root',
            password='umair',
            database='property_rental'
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM properties")
        properties = cursor.fetchall()
        cursor.close()
        conn.close()
        return properties
    except Exception as e:
        print(f"DB Error: {e}")
        return []

def build_index(properties):
    if not properties:
        return None, []

    texts = []
    for p in properties:
        text = f"{p['property_name']} in {p['location']} price {p['price']} status {p['status']}"
        texts.append(text)

    embeddings = model.encode(texts).astype('float32')
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    return index, texts

properties = get_properties_from_db()
index, texts = build_index(properties)
print(f"RAG ready — {len(properties)} properties loaded from database!")

def search_properties(query, top_k=3):
    if not properties or index is None:
        return []

    query_embedding = model.encode([query]).astype('float32')
    distances, indices = index.search(query_embedding, min(top_k, len(properties)))

    results = []
    for i, idx in enumerate(indices[0]):
        if idx < len(properties):
            prop = properties[idx]
            results.append({
                "property": {
                    "id": prop['id'],
                    "title": prop['property_name'],
                    "location": prop['location'],
                    "price": float(prop['price']),
                    "status": prop['status']
                },
                "score": round(float(distances[0][i]), 2)
            })

    return results

def rag_response(query):
    results = search_properties(query)

    if not results:
        return "Koi property nahi mili. Dobara search karein!"

    response = f"'{query}' ke liye {len(results)} properties mili hain:\n"

    for i, result in enumerate(results):
        prop = result["property"]
        response += f"\n{i+1}. {prop['title']}"
        response += f"\n   Location: {prop['location']}"
        response += f"\n   Rent: Rs. {prop['price']:,.0f} per month"
        response += f"\n   Status: {prop['status']}\n"

    return response

if __name__ == "__main__":
    print(rag_response("lahore mein flat chahiye"))
    print("---")
    print(rag_response("sasta ghar"))