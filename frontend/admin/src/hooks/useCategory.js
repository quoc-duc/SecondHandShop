import { useState, useEffect } from "react";
import axios from "axios";

function useCategory(page = 1, fieldSort = "", orderSort = "", searchKey = "") {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        let url = `http://localhost:5555/admin/categories?page=${page}`;

        if (fieldSort && orderSort) {
          url += `&sort=${orderSort}&sort=${fieldSort}`;
        }
        if (searchKey) {
          url += `&filter=category_name&filter=${searchKey}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.data;
        if (data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
          setTotalPages(data.totalPages || 1);
        } else throw new Error("Invalide response structure");
      } catch (err) {
        setError(err.message);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [page, fieldSort, orderSort, searchKey, refreshTrigger]);

  const createCategory = async (newCategory) => {
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/category/",
        newCategory,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        // Cập nhật ngay lập tức mà không cần load lại trang
        setCategories((prevCategories) => [
          ...prevCategories,
          response.data.data,
        ]);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const editCategory = async (id, updatedCategory) => {
    try {
      const response = await axios.put(
        `http://localhost:5555/admin/category/${id}`,
        updatedCategory,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setCategories((prevCategories) =>
          prevCategories.map((cat) =>
            cat._id === id ? response.data.data : cat
          )
        );
      }
    } catch (error) {
      console.error("Error editing category:", error);
    }
  };

  const deleteCategory = async (selectedIds) => {
    try {
      // Gửi request đến backend để xóa category
      await axios.delete("http://localhost:5555/admin/category", {
        data: { categoryIds: selectedIds },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCategories((prev) =>
        prev.filter((category) => !selectedIds.includes(category._id))
      );
      alert("Selected category deleted successfully");
      refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category.");
    }
  };

  return {
    categories,
    loading,
    error,
    totalPages,
    createCategory,
    editCategory,
    deleteCategory,
  };
}

export default useCategory;
