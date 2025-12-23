import requests

# Bước 1: Lấy dữ liệu từ API sản phẩm
product_api_url = 'http://192.168.1.248:5555/products'  # Thay đổi URL nếu cần
response = requests.get(product_api_url)

# In mã phản hồi và nội dung
print(f"Response Code: {response.status_code}")
print(f"Response Text: {response.text}")  # In ra nội dung phản hồi

if response.status_code == 200:
    # Bước 2: Chuyển đổi nội dung phản hồi thành JSON
    products = response.json()  # Chuyển đổi thành danh sách sản phẩm

    # Bước 3: Tạo dữ liệu dự đoán từ sản phẩm
    data = [
        {
            "_id": product["_id"],
            "name": product["name"],
            "image_url": product["image_url"]
        }
        for product in products  # Lặp qua các sản phẩm để lấy thông tin cần thiết
    ]

    # Bước 4: Gửi yêu cầu đến API dự đoán
    predict_url = 'http://127.0.0.1:5000/api/predict'
    prediction_response = requests.post(predict_url, json=data)

    # In mã phản hồi và nội dung
    print(f"Prediction Response Code: {prediction_response.status_code}")
    print(f"Prediction Response Text: {prediction_response.text}")  # In ra nội dung phản hồi
else:
    print("Không thể lấy dữ liệu từ API sản phẩm.")