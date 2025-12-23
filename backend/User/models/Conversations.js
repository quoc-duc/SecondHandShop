import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participant1: {
        type: String, // ID của người tham gia thứ nhất
        required: true,
    },
    participant2: {
        type: String, // ID của người tham gia thứ hai
        required: true,
    },
    lastMessage: {
        type: String, // Nội dung của tin nhắn cuối cùng
        default: '',
    },
    lastMessageTimestamp: {
        type: Date, // Thời gian của tin nhắn cuối cùng
        default: null,
    }
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

const Conversations = mongoose.model('Conversations', conversationSchema);
export default Conversations;