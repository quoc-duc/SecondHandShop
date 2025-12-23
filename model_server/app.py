from flask import Flask, request, jsonify
import numpy as np
import requests
from PIL import Image
from io import BytesIO
from tensorflow import keras

app = Flask(__name__)

# Tải mô hình đã huấn luyện
model = keras.models.load_model('saved_model.h5')

def load_image_from_url(url):
    """Tải hình ảnh từ URL và chuẩn bị cho mô hình."""
    response = requests.get(url)
    image = Image.open(BytesIO(response.content))
    image = image.resize((150, 150))  # Đảm bảo kích thước đúng
    image_array = np.array(image) / 255.0  # Chuyển đổi thành mảng numpy và chuẩn hóa
    return image_array

@app.route('/api/predict', methods=['POST'])
def predict():
    """Nhận yêu cầu POST với danh sách URL hình ảnh và trả về ID sản phẩm dự đoán."""
    data = request.json  # Nhận dữ liệu JSON
    images = []

    for product in data:  # Lặp qua từng sản phẩm trong dữ liệu
        try:
            image_url = product["image_url"]
            image_array = load_image_from_url(image_url)
            images.append(image_array)
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    images_array = np.array(images)  # Chuyển đổi danh sách hình ảnh thành mảng NumPy
    prediction = model.predict(images_array)  # Dự đoán với mô hình
    predicted_classes = np.argmax(prediction, axis=1)  # Lấy lớp dự đoán

    # Mapping giữa lớp và ID sản phẩm
    product_mapping = {
        0: "product_id_1",
        1: "product_id_2",
        2: "product_id_3",
        # Thêm các sản phẩm khác tương ứng với lớp
    }

    # Lấy ID sản phẩm từ lớp dự đoán
    product_ids = [product_mapping[class_id] for class_id in predicted_classes]

    # Tạo danh sách sản phẩm gợi ý
    suggested_products = [
        {'_id': product['_id'], 'name': product['name'], 'image_url': product['image_url']}
        for product, class_id in zip(data, predicted_classes)
    ]

    return jsonify({'suggested_products': suggested_products})  # Trả về danh sách sản phẩm gợi ý

if __name__ == '__main__':
    app.run(port=5000)  # Chạy server trên cổng 5000