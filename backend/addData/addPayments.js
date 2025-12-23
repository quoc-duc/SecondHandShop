import mongoose from 'mongoose';
import Payments from '../models/Payments.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addPayments = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

        // Dữ liệu thanh toán
        const paymentsData = [
            {
                // payment_id: 'payment001',
                type: 'Credit Card',
                order_id: '671e742333a9821831bb55ec',
                user_id: '671e7157dde710f9657f7c1b',
                total_price: 59.98,
                status_payment: 'Completed',
            },
            {
                // payment_id: 'payment002',
                type: 'PayPal',
                order_id: '671e742333a9821831bb55ed',
                user_id: '671e7157dde710f9657f7c1c',
                total_price: 89.99, 
                status_payment: 'Pending',
            },
        ];

        // Tạo và lưu tất cả thanh toán vào cơ sở dữ liệu
        const createdPayments = await Payments.create(paymentsData);

        console.log('Payments added successfully:');
        // console.log(createdPayments);
    } catch (error) {
        console.error('Error adding payments:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addPayments();

export default addPayments;