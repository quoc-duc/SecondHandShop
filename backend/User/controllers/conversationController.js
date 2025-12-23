import { createNewConversation, fetchUserConversations, findConversationById } from '../services/conversationService.js';

// Tạo cuộc trò chuyện mới
const createConversation = async (req, res) => {
    const { participant1, participant2 } = req.body;

    try {
        const newConversation = await createNewConversation(participant1, participant2);
        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ error: 'Error creating conversation' });
    }
};

const getOneConversation = async (req, res) => {
    const conversationId = req.params.conversationId;

    try {
        const conversations = await findConversationById(conversationId);
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching conversations' });
    }
};

// Lấy danh sách cuộc hội thoại của người dùng
const getConversations = async (req, res) => {
    const userId = req.params.userId;

    try {
        const conversations = await fetchUserConversations(userId);
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching conversations' });
    }
};

export { createConversation, getConversations, getOneConversation };