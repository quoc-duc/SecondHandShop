import express from 'express';
import {createReviewController, 
    //getActiveReviewsController, 
    getReviewByIdController, 
    getReviewByProductIdController, 
    updateReviewController, 
    deleteReviewController} from '../controllers/reviewController.js';

const reviewRoute = express.Router();

reviewRoute.post('/', createReviewController);
reviewRoute.get('/:id', getReviewByIdController);
reviewRoute.get('/product/:productId', getReviewByProductIdController);
reviewRoute.put('/:id', updateReviewController);
reviewRoute.delete('/:id', deleteReviewController);

export default reviewRoute;