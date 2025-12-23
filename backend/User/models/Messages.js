import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String, // ID của cuộc hội thoại (dưới dạng chuỗi)
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    statusMessage: {
        type: String,
        enum: ['sent', 'read'], // Trạng thái tin nhắn
        default: 'sent',
    },
}, {
    timestamps: true,
});

const Messages = mongoose.model('Messages', messageSchema);
export default Messages;