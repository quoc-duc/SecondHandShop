import { useState, useEffect } from "react";
import axios from "axios";

const useReview = (
  page = 1,
  fieldSort = "",
  orderSort = "",
  searchKey = ""
) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchReviews = async () => {
      let url = `http://localhost:5555/admin/reviews?page=${page}`;
      if (fieldSort && orderSort) {
        url += `&sort=${orderSort}&sort=${fieldSort}`;
      }
      if (searchKey) {
        url += `&filter=name_buyer&filter=${searchKey}`;
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
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page, fieldSort, orderSort, searchKey, refreshTrigger]);

  const deleteReview = async (selectedIds) => {
    try {
      await axios.delete("http://localhost:5555/admin/reviews", {
        data: { reviewIds: selectedIds },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setReviews((prev) =>
        prev.filter((review) => !selectedIds.includes(review._id))
      );
      alert("Selected review delected successfully!");
      refresh();
    } catch {
      alert("Failed to delete selected review!");
    }
  };

  return {
    reviews,
    loading,
    error,
    totalPages,
    deleteReview,
  };
};

export default useReview;
