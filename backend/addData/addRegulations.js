import mongoose from 'mongoose';
import Regulations from '../models/Regulations.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addRegulations = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

        // Dữ liệu quy định
        const regulationsData = [
            {
                // regulation_id: 'regulation001',
                user_id: '671e7157dde710f9657f7c1b',
                title: 'Privacy Policy',
                description: 'This document outlines our policies on user data collection and usage.',
                status: true,
            },
            {
                // regulation_id: 'regulation002',
                user_id: '671e7157dde710f9657f7c1b',
                title: 'Terms of Service',
                description: 'These terms govern the use of our services and the rights of users.',
                status: true,
            },
        ];

        // Tạo và lưu tất cả quy định vào cơ sở dữ liệu
        const createdRegulations = await Regulations.create(regulationsData);

        console.log('Regulations added successfully:');
        // console.log(createdRegulations);
    } catch (error) {
        console.error('Error adding regulations:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addRegulations();

export default addRegulations;