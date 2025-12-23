import {
  getAllReviews,
  deleteReview,
} from "../../services/reviews/adminReviewService.js";

//----------------------Lấy tất cả Reviews---------------------------
const fetchAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter || null;

    const result = await getAllReviews(page, limit, sort, filter);
    res.status(200).json({
      success: true,
      totalReviews: result.totalReviews,
      totalPages: result.totalPages,
      limit: result.limit,
      currentPage: result.currentPage,
      skip: result.skip,
      reviews: result.reviewDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//----------------------Xóa Reviews---------------------------
const removeReview = async (req, res) => {
  const { reviewIds } = req.body;

  if (!reviewIds || reviewIds.length === 0) {
    return res.status(400).json({ message: "No reviews IDs" });
  }

  try {
    const deleteReviews = await deleteReview(reviewIds);
    res.status(200).json({
      message: "Reviews delete successfully",
      reviewCounts: deleteReviews.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete",
      error: error.message,
    });
  }
};

export { fetchAllReviews, removeReview };
