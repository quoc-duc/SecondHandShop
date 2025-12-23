import mongoose from 'mongoose';
import Products from '../models/Products.js'; // Đảm bảo đường dẫn đúng
import { v4 as uuidv4 } from 'uuid'; // Sử dụng uuid để tạo ID sản phẩm

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addProducts = async () => {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

    // Dữ liệu sản phẩm
    const productsData = [
      {
        // product_id: 'product001', //uuidv4(), // Tạo ID sản phẩm duy nhất
        name: 'Product One',
        description: 'Description for Product One',
        price: 19.99,
        quantity: 100,
        category_id: '671e709713346e5cf157c1fa',
        image_url: 'https://example.com/product1.png',
        user_id: '671e7157dde710f9657f7c1b',
        status: true,
      },
      {
        // product_id: 'product002', //uuidv4(), // Tạo ID sản phẩm duy nhất
        name: 'Product Two',
        description: 'Description for Product Two',
        price: 29.99,
        quantity: 50,
        category_id: '671e709713346e5cf157c1fa',
        image_url: 'https://example.com/product2.png',
        user_id: '671e7157dde710f9657f7c1b',
        status: true,
      },
      {
        // product_id: 'product003', //uuidv4(), // Tạo ID sản phẩm duy nhất
        name: 'Product 3',
        description: 'Description for Product 3',
        price: 23.99,
        quantity: 50,
        category_id: '671e709713346e5cf157c1fb',
        image_url: 'https://example.com/product3.png',
        user_id: '671e7157dde710f9657f7c1c',
        status: true,
      },
    ];

    // Tạo và lưu tất cả sản phẩm vào cơ sở dữ liệu
    const createdProducts = await Products.create(productsData);

    console.log('Products added successfully:');
    // console.log(createdProducts);
  } catch (error) {
    console.error('Error adding products:', error);
  } finally {
    // Ngắt kết nối
    await mongoose.connection.close();
  }
};
// addProducts();

export default addProducts;