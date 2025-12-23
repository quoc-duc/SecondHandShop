import fs from 'fs';
import axios from 'axios';

// Hàm để thêm sản phẩm
const addProduct = async (product) => {
    try {
        const response = await axios.post('http://localhost:5555/products', product);
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

// Hàm để đọc file và thêm sản phẩm
const addProductsFromFile = async (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.trim().split('\n');
        
        // Lấy tiêu đề từ dòng đầu tiên
        const headers = lines[0].split(',');

        // Lặp qua các dòng dữ liệu và thêm sản phẩm
        for (const line of lines.slice(1)) {
            const values = line.split(',');
            const product = {};

            // Tạo đối tượng sản phẩm
            headers.forEach((header, index) => {
                product[header.trim()] = values[index].trim();
            });

            // Gọi hàm addProduct
            const result = await addProduct(product);
            console.log('Added product:', result);
        }
    } catch (error) {
        console.error('Error reading file or adding products:', error);
    }
};

// Đường dẫn tới file dữ liệu
const filePath = 'D:\\Hoc_Ki_8\\KLTN\\add.txt';

// Gọi hàm để thêm sản phẩm từ file
addProductsFromFile(filePath);