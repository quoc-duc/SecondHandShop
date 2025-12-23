import { useState, useEffect } from "react";
import axios from "axios";

export const useCategoryDetails = (categoryId) => {
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategoryDetails = async () => {
    if (!categoryId) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5555/admin/sub-category-by-parent/${categoryId}`
      );
      setCategoryDetails(response.data);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Error fetching category details"
      );
    } finally {
      setLoading(false);
    }
  };

  const createCategoryDetail = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/admin/sub-category",
        {
          ...data,
          category_id: categoryId,
        }
      );
      setCategoryDetails([...categoryDetails, response.data]);
      return response.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Error creating category detail"
      );
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, [categoryId]);

  return {
    categoryDetails,
    loading,
    error,
    createCategoryDetail,
    refetch: fetchCategoryDetails,
  };
};
