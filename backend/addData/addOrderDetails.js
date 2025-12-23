import mongoose from 'mongoose';
import OrderDetails from '../User/models/OrderDetails.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addOrderDetails = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect('mongodb+srv://minhquan31102003:f3n9fJaQYv7YYdIa@muabandocu.8c5m9.mongodb.net/?retryWrites=true&w=majority&appName=MuaBanDoCu');

        // Dữ liệu chi tiết đơn hàng
        const orderDetailsData = [
            {
                // order_detail_id: 'detail001',
                order_id: '671e742333a9821831bb55ec',
                product_id: '671e72cd20f7c6cc681c70a0', 
                quantity: 2,
                price: 29.99, 
            },
            {
                // order_detail_id: 'detail002',
                order_id: '671e742333a9821831bb55ec', 
                product_id: '671e72cd20f7c6cc681c70a1',
                quantity: 1,
                price: 19.99, 
            },
            {
                // order_detail_id: 'detail003',
                order_id: '671e742333a9821831bb55ed',
                product_id: '671e72cd20f7c6cc681c70a2', 
                quantity: 1,
                price: 89.99, 
            },
        ];

        const createdOrderDetails = await OrderDetails.create(orderDetailsData);

        // const createdOrderDetails = await OrderDetails.deleteMany({ product_id: '672b308c84ffd1107d916885' });

        console.log('Order details added successfully:');
        // console.log(createdOrderDetails);
    } catch (error) {
        console.error('Error adding order details:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addOrderDetails();

export default addOrderDetails;