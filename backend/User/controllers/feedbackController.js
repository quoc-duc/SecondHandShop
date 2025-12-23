import {createFeedback, 
    getActiveFeedbacks, 
    getActiveFeedbacksByUserId, 
    deleteFeedback} from '../services/feedbackService.js';

const createFeedbackController = async (req, res) => {
    try {
        const feedback = await createFeedback(req.body);
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActiveFeedbacksController = async (req, res) => {
    try {
      const feedbacks = await getActiveFeedbacks();
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const getActiveFeedbacksByUserIdController = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const feedbacks = await getActiveFeedbacksByUserId(userId);
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

const deleteFeedbackController = async (req, res) => {
    const { feedbackId } = req.params;
  
    try {
      const updatedFeedback = await deleteFeedback(feedbackId);
      res.status(200).json(updatedFeedback);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

export {createFeedbackController, getActiveFeedbacksController, getActiveFeedbacksByUserIdController,
    deleteFeedbackController}