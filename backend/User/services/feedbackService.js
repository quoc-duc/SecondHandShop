import Feedbacks from '../models/Feedbacks.js';

const createFeedback = async (feedbackData) => {
    const feedback = new Feedbacks(feedbackData);
    return await feedback.save();
};

const getActiveFeedbacks = async () => {
    return await Feedbacks.find({ status: true });
};

const getActiveFeedbacksByUserId = async (userId) => {
    return await Feedbacks.find({ user_id: userId, status: true });
};

const deleteFeedback = async (feedbackId) => {
    return await Feedbacks.findByIdAndUpdate(
        feedbackId,
        { status: false },
        { new: true }
    );
};

export {createFeedback, getActiveFeedbacks, getActiveFeedbacksByUserId, deleteFeedback}