import requests
# Bước 1: Lấy dữ liệu từ API sản phẩm
product_api_url = 'http://192.168.1.248:5555/products'  # Thay đổi URL nếu cần
response = requests.get(product_api_url)

# In mã phản hồi và nội dung
print(f"Response Code: {response.status_code}")
print(f"Response Text: {response.text}")  # In ra nội dung phản hồi