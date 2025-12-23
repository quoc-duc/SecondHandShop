import express from 'express';
import {addNotification, 
    getNotifications, 
    getNotificationsUserId, 
    removeNotification,
    updateNotificationController } from '../controllers/notificationController.js';

const notificationRoute = express.Router();

notificationRoute.post('/', addNotification);
notificationRoute.get('/', getNotifications);
notificationRoute.put('/update', updateNotificationController);
notificationRoute.get('/user/:userId', getNotificationsUserId);
notificationRoute.delete('/:id', removeNotification);

export default notificationRoute;