import { useState, useEffect } from "react";
import axios from "axios";

const useRegulation = (
  page = 1,
  fieldSort = "",
  orderSort = "",
  searchKey = ""
) => {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [success, setSuccess] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalRegulations, setTotalRegulations] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  // Hàm fetch regulations
  useEffect(() => {
    const fetchRegulations = async () => {
      let url = `http://localhost:5555/admin/regulations?page=${page}`;
      if (fieldSort && orderSort) {
        url += `&sort=${orderSort}&sort=${fieldSort}`;
      }
      if (searchKey) {
        url += `&filter=title&filter=${searchKey}`;
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

        if (data.success && Array.isArray(data.regulations)) {
          setRegulations(data.regulations);
          setTotalPages(data.totalPages || 1);
          setTotalRegulations(data.totalRegulations || 0);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setRegulations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRegulations();
  }, [page, fieldSort, orderSort, searchKey, refreshTrigger]);

  // Hàm post regulation
  const postRegulation = async (newRegulation) => {
    try {
      const response = await axios.post(
        "http://localhost:5555/admin/regulation/",
        newRegulation,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        // Cập nhật ngay lập tức mà không cần load lại trang
        setRegulations((prevRegulations) => [
          ...prevRegulations,
          response.data.data,
        ]);
      }
    } catch {
      setError("Error posting regulation");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa regulation
  const deleteRegulation = async (selectedIds) => {
    try {
      await axios.delete("http://localhost:5555/admin/regulation", {
        data: { regulationIds: selectedIds },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setRegulations((prev) =>
        prev.filter((regulation) => !selectedIds.includes(regulation._id))
      );
      alert("Selected regulations deleted successfully");
      refresh();
    } catch {
      setError("Error deleting regulation");
    }
  };

  // Hàm tùy chỉnh regulation (cập nhật regulation)
  // const customRegulation = async (id, updatedData) => {
  //   try {
  //     await axios.put(
  //       `http://localhost:5555/admin/regulation/${id}`,
  //       updatedData
  //     );
  //     // After updating, fetch regulations again to refresh the list
  //     await fetchRegulations();
  //   } catch (err) {
  //     setError("Error updating regulation");
  //   }
  // };

  const customRegulation = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `http://localhost:5555/admin/regulation/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setRegulations((prevRegulations) =>
          prevRegulations.map((regulation) =>
            regulation._id === id ? response.data.data : regulation
          )
        );
      }
    } catch (error) {
      console.error("Error updating regulation:", error);
    }
  };

  return {
    regulations,
    loading,
    error,
    totalPages,
    deleteRegulation,
    customRegulation,
    postRegulation,
    success,
    totalRegulations,
  };
};

export default useRegulation;
