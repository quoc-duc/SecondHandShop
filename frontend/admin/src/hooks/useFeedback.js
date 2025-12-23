import { useState, useEffect } from "react";
import axios from "axios";

const useFeedback = (
  page = 1,
  fieldSort,
  orderSort,
  searchKey,
  refetchTrigger = 0
) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  useEffect(() => {
    const fetchFeedback = async () => {
      let url = `http://localhost:5555/admin/all-feedback?page=${page}`;

      if (fieldSort && orderSort) {
        url += `&sort=${orderSort}&sort=${fieldSort}`;
      }

      if (searchKey) {
        url += `&filter=username&filter=${searchKey}`;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.data;
        if (data.success && Array.isArray(data.feedbacks)) {
          setFeedbacks(data.feedbacks);
          setTotalPages(data.totalPages || 1);
          setTotalFeedbacks(data.totalFeedbacks || 0);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [page, fieldSort, orderSort, searchKey, refetchTrigger]);

  const ReplyFeedback = async (feedbackId, subject, message) => {
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/reply",
        { feedbackId, subject, message },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        return response.data.message;
      } else {
        throw new Error("Failed to send reply");
      }
    } catch (err) {
      setError(err.message + "hi");
    }
  };

  return {
    feedbacks,
    totalPages,
    loading,
    error,
    ReplyFeedback,
    totalFeedbacks,
  }; // Trả về feedbackTotal
};

export default useFeedback;
