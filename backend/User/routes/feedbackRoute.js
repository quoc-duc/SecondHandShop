import express from 'express';
import {
    createFeedbackController,
    getActiveFeedbacksController,
    getActiveFeedbacksByUserIdController,
    deleteFeedbackController} from '../controllers/feedbackController.js';

const feedbackRoute = express.Router();

feedbackRoute.post('/', createFeedbackController);
feedbackRoute.get('/', getActiveFeedbacksController);
feedbackRoute.get('/user/:userId', getActiveFeedbacksByUserIdController);
feedbackRoute.delete('/:id', deleteFeedbackController);

export default feedbackRoute;