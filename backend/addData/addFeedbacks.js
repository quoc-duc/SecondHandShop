import mongoose from 'mongoose';
import Feedbacks from '../models/Feedbacks.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addFeedbacks = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

        // Dữ liệu phản hồi
        const feedbackData = [
            {
                // feedback_id: 'feedback001',
                user_id: '671e7157dde710f9657f7c1c',
                message: 'Great service, very satisfied!',
                status: 'true',
            },
            {
                // feedback_id: 'feedback002',
                user_id: '671e7157dde710f9657f7c1c',
                message: 'The product quality is excellent!',
                status: 'true',

            },
        ];

        // Tạo và lưu tất cả phản hồi vào cơ sở dữ liệu
        const createdFeedbacks = await Feedbacks.create(feedbackData);

        console.log('Feedbacks added successfully:');
        // console.log(createdFeedbacks);
    } catch (error) {
        console.error('Error adding feedbacks:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addFeedbacks();

export default addFeedbacks;