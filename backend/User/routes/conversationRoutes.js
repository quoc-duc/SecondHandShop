import express from 'express';
import { createConversation, getConversations, getOneConversation } from '../controllers/conversationController.js';

const conversationRouter = express.Router();

// Tạo cuộc trò chuyện mới
conversationRouter.post('/', createConversation);

// Lấy danh sách cuộc hội thoại của người dùng
conversationRouter.get('/:userId', getConversations);

conversationRouter.get('/byId/:conversationId', getOneConversation);

export default conversationRouter;