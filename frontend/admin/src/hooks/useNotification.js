import { useState, useEffect } from "react";
import axios from "axios";

const useNotification = (page = 1) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    // Fetch all notifications
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        let url = `http://localhost:5555/admin/notifications?page=${page}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.data;
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [page, refreshTrigger]);

  // Post a new notification
  const postNotification = async (payload) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/notifications/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err; // Rethrow to handle in component
    } finally {
      setLoading(false);
    }
  };

  // Remove a notification by setting its status to false
  const removeNotification = async (selectedIds) => {
    try {
      await axios.delete("http://localhost:5555/admin/notifications", {
        data: { notificationIds: selectedIds },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setNotifications((prev) =>
        prev.filter((notification) => !selectedIds.includes(notification._id))
      );
      alert("Selected notification deleted successfully");
      refresh();
    } catch {
      alert("Failed to delete selected notifications");
    }
  };

  return {
    notifications,
    loading,
    error,
    totalPages,
    postNotification,
    removeNotification, // Expose removeNotification
  };
};

export default useNotification;
