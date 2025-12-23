from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
from pymongo import MongoClient
import pickle


app = Flask(__name__)
CORS(app)


MONGODB_URI = "mongodb+srv://minhquan31102003:f3n9fJaQYv7YYdIa@muabandocu.8c5m9.mongodb.net/?retryWrites=true&w=majority&appName=MuaBanDoCu"
client = MongoClient(MONGODB_URI)
db = client["test"]
products_collection = db["products"]
reviews_collection = db["reviews"]



user_encoder = pickle.load(open("user_encoder.pkl", "rb"))
product_encoder = pickle.load(open("product_encoder.pkl", "rb"))
model = load_model("ncf_best.keras")


@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    if user_id not in user_encoder.classes_:
        return jsonify({"error": f"Unknown user_id: {user_id}"}), 400

    user_idx = user_encoder.transform([user_id])[0]
    reviewed_products = reviews_collection.find({"user_id": user_id})
    reviewed_ids = {r['product_id'] for r in reviewed_products}
    print(f"User ID: {user_id}")
    print(f"Reviewed products: {reviewed_ids}")

    all_products = list(products_collection.find({}))
    unreviewed_products = [p for p in all_products if p['_id'] not in reviewed_ids and p.get('quantity', 0) > 0]
    print(f"Number of unreviewed products: {len(unreviewed_products)}")

    if not unreviewed_products:
        return jsonify({"message": "No recommendations available"}), 200

    product_ids = [str(p['_id']) for p in unreviewed_products if str(p['_id']) in product_encoder.classes_]
    if not product_ids:
        return jsonify({"message": "No recommendations available due to no known products"}), 200
    print(f"Number of known product IDs: {len(product_ids)}")

    product_idx = product_encoder.transform(product_ids)
    filtered_unreviewed_products = [p for p in unreviewed_products if str(p['_id']) in product_ids]
    print(f"Number of filtered unreviewed products: {len(filtered_unreviewed_products)}")

    user_reviews = list(reviews_collection.find({"user_id": user_id}))
    user_review_count = len(user_reviews)
    avg_user_rating = sum(r.get("rating", 0) for r in user_reviews) / max(user_review_count, 1)
    user_feat = np.array([[user_review_count, avg_user_rating]] * len(product_idx))
    print(f"User features: {user_feat[0]}")

    product_features = []
    for p in filtered_unreviewed_products:
        prod_id = str(p['_id'])
        prod_reviews = list(reviews_collection.find({"product_id": prod_id}))
        prod_review_count = len(prod_reviews)
        avg_prod_rating = sum(r.get("rating", 0) for r in prod_reviews) / max(prod_review_count, 1)
        product_features.append([prod_review_count, avg_prod_rating])
    product_feat = np.array(product_features)
    print(f"Sample product features: {product_feat[:5]}")

    user_input = np.array([user_idx] * len(product_idx)).reshape(-1, 1)
    product_input = np.array(product_idx).reshape(-1, 1)

    predictions = model.predict([user_input, product_input, user_feat, product_feat])
    scores = predictions.flatten()
    print(f"Predicted scores range: min={scores.min()}, max={scores.max()}, mean={scores.mean()}")

    limit = min(len(scores), len(filtered_unreviewed_products))
    scored_products = [(scores[i], filtered_unreviewed_products[i]) for i in range(limit)]
    scored_products.sort(reverse=True)
    
    result = []
    for score, product in scored_products[:10]: 
        video_url = product.get("video_url", "")
        if isinstance(video_url, list):
            video_url = video_url[0] if video_url else ""

        result.append({
            "_id": str(product['_id']),
            "name": product.get("name", "No name"),
            "description": product.get("description", "No description"),
            "price": product.get("price", 0.0),
            "quantity": product.get("quantity", 0),
            "category_id": product.get("category_id", "Uncategorized"),
            "user_id": product.get("user_id", "Unknown"),
            "status": product.get("status"),
            "approve": product.get("approve"),
            "brand": product.get("brand"),
            "condition": product.get("condition"),
            "origin": product.get("origin"),
            "image_url": product.get("image_url"),
            "score": float(score),
            "video_url": video_url,
            "partner": product.get("partner")
        })
    # print(f"Top 10 scores: {[float(s) for s, _ in scored_products[:10]]}")
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    app.run(port=5000)
