import mongoose from 'mongoose';
import Reviews from '../models/Reviews.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addReviews = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

        // Dữ liệu đánh giá
        const reviewsData = [
            {
                // review_id: 'review001',
                product_id: '671e72cd20f7c6cc681c70a0',
                user_id: 'user001',
                rating: 5,
                comment: 'Amazing product, highly recommend!',
                status: true,
            },
            {
                // review_id: 'review002',
                product_id: '671e72cd20f7c6cc681c70a0',
                user_id: '671e7157dde710f9657f7c1b',
                rating: 4,
                comment: 'Good quality, but the delivery was late.',
                status: true,
            },
            {
                // review_id: 'review003',
                product_id: '671e72cd20f7c6cc681c70a1',
                user_id: '671e7157dde710f9657f7c1c',
                rating: 3,
                comment: 'It was okay, nothing special.',
                status: true,
            },
        ];

        // Tạo và lưu tất cả đánh giá vào cơ sở dữ liệu
        const createdReviews = await Reviews.create(reviewsData);

        console.log('Reviews added successfully:');
        // console.log(createdReviews);
    } catch (error) {
        console.error('Error adding reviews:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addReviews();

export default addReviews;