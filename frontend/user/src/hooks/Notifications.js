import axios from "axios";
import { IP } from "../config";

const updateNotification = async (notificationId, readed) => {
    try {
        const response = await axios.put(`http://${IP}:5555/notifications/update`, { notificationId, readed });
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error updating notification:', error);
        throw error;
    }
};

const createNotification = async (notification) => {
    try {
        const response = await axios.post(`http://${IP}:5555/notifications`, notification);
        const data = response.data;
        return data;
    } catch (error) {
        console.error('Error create notification:', error);
        throw error;
    }
};

export {updateNotification, createNotification}