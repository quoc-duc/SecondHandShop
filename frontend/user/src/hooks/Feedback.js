import axios from "axios";
import { IP } from "../config";

const createFeedback = async (feedback) => {
    try {
        const response = await axios.post(`http://${IP}:5555/feedbacks`, feedback);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error create feedback:', error);
        throw error;
    }
};

export {createFeedback}