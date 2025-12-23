import {
  getAllNotifications,
  createNotification,
  deleteNotification,
} from "../../services/notification/adminNotificationService.js";

export const fetchAllNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await getAllNotifications(page, limit);
    res.status(200).json({
      success: true,
      totalNotifications: result.totalNotifications,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      skip: result.skip,
      notifications: result.notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const postNotification = async (req, res) => {
  const { message, user_id_created, user_id_receive, role } = req.body;

  try {
    if (!message || !user_id_created) {
      return res.status(400).json({
        success: false,
        message: "Message and user_id_created are required.",
      });
    }

    const notifications = await createNotification({
      message,
      user_id_created,
      user_id_receive,
      role,
    });

    if (notifications.length === 0) {
      return res.status(500).json({
        success: false,
        message: "No notifications were created.",
      });
    }

    res.status(201).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(`Error in postNotification: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeNotification = async (req, res) => {
  const { notificationIds } = req.body;

  if (!notificationIds || notificationIds.length === 0) {
    res.status(400).json({ message: "No notification IDs provided" });
  }

  try {
    const deletedNotifications = await deleteNotification(notificationIds);

    res.status(200).json({
      message: "Notification deleted successfully.",
      deleteCount: deletedNotifications.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};
