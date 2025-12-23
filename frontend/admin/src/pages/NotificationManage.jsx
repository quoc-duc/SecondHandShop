import { useState } from "react";

import NotificationList from "../components/NotificationManage/NotificationList";
import NotificationPost from "../components/NotificationManage/NotificationPost";

const NotificationManage = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);

  const openNotificationForm = (notification = null) => {
    setSelectedNotification(notification);
    setShowNotificationForm(true);
  };

  const closeNotificationForm = () => {
    setSelectedNotification(null);
    setShowNotificationForm(false);
  };

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md ">
      <div className="mt-4 pl-4">
        <button
          onClick={() => openNotificationForm()}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Tạo thông báo mới
        </button>
      </div>
      <div className="mb-6">
        {showNotificationForm && (
          <NotificationPost
            selectedNotification={selectedNotification}
            closeForm={closeNotificationForm}
          />
        )}
      </div>
      <div>
        <NotificationList openNotificationForm={openNotificationForm} />
      </div>
    </div>
  );
};

export default NotificationManage;
