import {
  getAllFeedbacks,
  replyToFeedback,
} from "../../services/feedback/adminFeedbackService.js";

const getFeedbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter;
    const result = await getAllFeedbacks(page, limit, sort, filter);
    res.status(200).json({
      success: true,
      totalFeedbacks: result.totalFeedbacks,
      totalPages: result.totalPages,
      limit: result.limit,
      skip: result.skip,
      currentPage: result.currentPage,
      feedbacks: result.feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendFeedbackReply = async (req, res) => {
  const { feedbackId, subject, message } = req.body;
  try {
    const result = await replyToFeedback(feedbackId, subject, message);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { getFeedbacks, sendFeedbackReply };
