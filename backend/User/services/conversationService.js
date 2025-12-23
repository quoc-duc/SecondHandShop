import Conversations from '../models/Conversations.js';

// Tạo cuộc trò chuyện mới
const createNewConversation = async (participant1, participant2) => {
    const newConversation = new Conversations({
        participant1,
        participant2,
    });

    return await newConversation.save();
};

const findConversationById = async (Id) => {
    return await Conversations.findOne({ _id: Id});
};

// Lấy danh sách cuộc hội thoại của người dùng
const fetchUserConversations = async (userId) => {
    return await Conversations.find({
        $or: [
            { participant1: userId },
            { participant2: userId },
        ],
    });
};

export { createNewConversation, fetchUserConversations, findConversationById };