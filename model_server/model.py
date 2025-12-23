import numpy as np
import tensorflow as tf
from keras import layers, models
from sklearn.model_selection import train_test_split

# Tạo mô hình CNN
def create_model(input_shape, num_classes):
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
        layers.MaxPooling2D((2, 2)),
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Flatten(),
        layers.Dense(64, activation='relu'),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
    return model

# Dữ liệu giả lập (thay đổi bằng dữ liệu thực tế của bạn)
num_classes = 3  # Số lớp sản phẩm
input_shape = (150, 150, 3)  # Kích thước hình ảnh

# Tạo dữ liệu huấn luyện giả lập
train_images = np.random.rand(1000, 150, 150, 3)  # 1000 hình ảnh ngẫu nhiên
train_labels = np.random.randint(num_classes, size=(1000,))  # Nhãn ngẫu nhiên

# Chia dữ liệu thành tập huấn luyện và tập kiểm tra
x_train, x_test, y_train, y_test = train_test_split(train_images, train_labels, test_size=0.2)

# Tạo và huấn luyện mô hình
model = create_model(input_shape, num_classes)
model.fit(x_train, y_train, epochs=10)

# Lưu mô hình
model.save('saved_model.h5')
print("Mô hình đã được lưu vào saved_model.h5")