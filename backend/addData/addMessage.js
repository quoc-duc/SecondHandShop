import mongoose from 'mongoose';
import Messages from '../User/models/Messages.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addMessages = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

        // Dữ liệu tin nhắn
        const messagesData = [
            {
                content: 'Chào bạn! Bạn còn hàng không?',
                senderId: '672a65c715ecbf5e871dfbb7',
                receiverId: '672a66c7acb5bee7310d21b9',
                statusMessage: 'sent',
            },
            {
                content: 'Chào! Tôi còn hàng. Bạn muốn biết thêm thông tin gì?',
                senderId: '672a66c7acb5bee7310d21b9',
                receiverId: '672a65c715ecbf5e871dfbb7',
                statusMessage: 'delivered',
            },
            {
                content: 'Có thể cho tôi biết giá cả không?',
                senderId: '672a65c715ecbf5e871dfbb7',
                receiverId: '672a66c7acb5bee7310d21b9',
                statusMessage: 'sent',
            },
        ];

        // Tạo và lưu tất cả tin nhắn vào cơ sở dữ liệu
        const createdMessages = await Messages.create(messagesData);

        console.log('Messages added successfully:');
        console.log(createdMessages); // Hiển thị danh sách tin nhắn đã thêm
    } catch (error) {
        console.error('Error adding messages:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// Gọi hàm để thêm tin nhắn
addMessages();

export default addMessages;