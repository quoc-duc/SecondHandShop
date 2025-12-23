import mongoose from 'mongoose';
import Notifications from '../models/Notifications.js';

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addNotifications = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

        // Dữ liệu thông báo
        const notificationsData = [
            {
                // notification_id: 'notification001',
                user_id_created: '671e7157dde710f9657f7c1b',
                message: 'Your order has been shipped!',
                status: true,
            },
            {
                // notification_id: 'notification002',
                user_id_created: '671e7157dde710f9657f7c1b',
                message: 'Your payment was successful!',
                status: true,
            },
        ];

        // Tạo và lưu tất cả thông báo vào cơ sở dữ liệu
        const createdNotifications = await Notifications.create(notificationsData);

        console.log('Notifications added successfully:');
        // console.log(createdNotifications);
    } catch (error) {
        console.error('Error adding notifications:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addNotifications();

export default addNotifications;