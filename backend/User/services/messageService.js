import Messages from '../models/Messages.js';

// Gửi tin nhắn
const sendMessage = async (content, senderId, receiverId) => {
    const message = new Messages({ content, senderId, receiverId });
    await message.save();
    return message;
};

// Lấy tất cả tin nhắn giữa hai người dùng
const getMessagesByUser = async (userId1, userId2) => {
    return await Messages.find({
        $or: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 }
        ]
    }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian tạo
};

// Lấy danh sách cuộc hội thoại
const getConversations = async (userId) => {
  const messages = await Messages.find({
    $or: [
        { senderId: userId },
        { receiverId: userId },
    ],
}).sort({ createdAt: 1 }); // Sắp xếp theo thời gian tạo

const conversations = {};

messages.forEach(message => {
    const participants = [message.senderId, message.receiverId].sort().join('-');
    if (!conversations[participants]) {
        conversations[participants] = {
            participants: [message.senderId, message.receiverId],
            lastMessage: message.content,
            lastTimestamp: message.createdAt,
        };
    } else {
        conversations[participants].lastMessage = message.content;
        conversations[participants].lastTimestamp = message.createdAt;
    }
});

return Object.values(conversations);
};

// Lấy tin nhắn theo cuộc hội thoại
const getMessagesByParticipants = async (participants) => {
    const [senderId, receiverId] = participants.split('-');
    return await Messages.find({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
        ],
    }).sort({ createdAt: 1 }); // Sắp xếp theo thời gian
};

const readMessageByConversationId = async (converId, sender) => {
    try {
        const result = await Messages.updateMany(
            { conversationId: converId, statusMessage: 'sent', senderId: sender },
            { $set: { statusMessage: 'read' } }
        );
        return result;
    } catch (error) {
        throw new Error('Error updating messages: ' + error.message);
    }
};

export { sendMessage, getMessagesByUser, getConversations, getMessagesByParticipants, readMessageByConversationId };