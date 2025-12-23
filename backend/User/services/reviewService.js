import Reviews from '../models/Reviews.js';

const createReview = async (reviewData) => {
    const review = new Reviews(reviewData);
    return await review.save();
};

const getActiveReviews = async () => {
    return await Reviews.find({ status: true });
};

const getReviewById = async (reviewId) => {
    return await Reviews.findOne({ _id: reviewId, status: true });
};

const getReviewByProductId = async (productId) => {
    return await Reviews.find({ product_id: productId, status: true });
};

const updateReview = async (reviewId, updateData) => {
    return await Reviews.findByIdAndUpdate(reviewId, updateData, { new: true });
};

const deleteReview = async (reviewId) => {
    return await Reviews.findByIdAndUpdate(
        reviewId,
        { status: false },
        { new: true }
    );
};

export {
    createReview,
    getActiveReviews,
    getReviewById,
    getReviewByProductId,
    updateReview,
    deleteReview
};