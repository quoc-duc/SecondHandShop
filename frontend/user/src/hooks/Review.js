import { useEffect, useState } from 'react';
import axios from 'axios';
import { IP } from '../config';

const useReviews = (productId) => {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoading] = useState(true);
    const [errorReviews, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://${IP}:5555/reviews/product/${productId}`); // Thay đổi với endpoint phù hợp
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    return { reviews, loadingReviews, errorReviews };
};

const addReview = async (review) => {
    try {
        const response = await axios.post(`http://${IP}:5555/reviews`, review);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error add product:', error);
        throw error;
    }
};

export {useReviews, addReview};