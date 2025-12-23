import {
    createReview,
    getActiveReviews,
    getReviewById,
    getReviewByProductId,
    updateReview,
    deleteReview
} from '../services/reviewService.js';

const createReviewController = async (req, res) => {
    try {
        const review = await createReview(req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getActiveReviewsController = async (req, res) => {
    try {
        const reviews = await getActiveReviews();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviewByIdController = async (req, res) => {
    try {
        const review = await getReviewById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getReviewByProductIdController = async (req, res) => {
    const { productId } = req.params;
    try {
        const review = await getReviewByProductId(productId);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateReviewController = async (req, res) => {
    try {
        const product = await updateReview(req.params.id, req.body);
        if (!product) {
            return res.status(404).send({ message: 'Review not found' });
        }
        return res.status(200).send(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

const deleteReviewController = async (req, res) => {
    try {
        const product = await deleteReview(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Review not found' });
        }
        return res.status(204).send({message: 'Xoá thành công'});
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

export {createReviewController, 
    //getActiveReviewsController, 
    getReviewByIdController, 
    getReviewByProductIdController, 
    updateReviewController, 
    deleteReviewController}