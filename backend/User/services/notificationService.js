import Notifications from "../models/Notifications.js";

const createNotification = async (notificationData) => {
  const notification = new Notifications(notificationData);
  return await notification.save();
};

const getActiveNotifications = async () => {
  return await Notifications.find({ status: true });
};

// const getActiveNotificationsByUserId = async (userId) => {
//   try {
//     return await Notifications.find({ user_id_receive: userId, status: true });
//   } catch (error) {
//     throw new Error(`Unable to fetch notifications for user: ${error.message}`);
//   }
// };

const getActiveNotificationsByUserId = async (userId) => {
  try {
    const query = { status: true }; // Chỉ lấy thông báo có status là true

    // Nếu có userId, lấy cả thông báo có userId và không có userId
    if (userId) {
      query.$or = [
        { user_id_receive: userId },
        { user_id_receive: { $exists: false } } // Thông báo không có userId
      ];
    } else {
      // Nếu không có userId, chỉ lấy thông báo không có userId
      query.user_id_receive = { $exists: false };
    }

    return await Notifications.find(query);
  } catch (error) {
    throw new Error(`Unable to fetch notifications for user: ${error.message}`);
  }
};

const deleteNotification = async (notificationId) => {
  return await Notifications.findByIdAndUpdate(
    notificationId,
    { status: false },
    { new: true }
  );
};

const updateNotification = async (notificationId, updateData) => {
  try {
      const updatedNotification = await Notifications.findByIdAndUpdate(
          notificationId,
          updateData,
          { new: true} // Trả về bản ghi mới và chạy các bộ kiểm tra
      );
      return updatedNotification;
  } catch (error) {
      throw new Error(`Unable to update notification: ${error.message}`);
  }
};

export {createNotification, getActiveNotifications, getActiveNotificationsByUserId, deleteNotification, updateNotification}

