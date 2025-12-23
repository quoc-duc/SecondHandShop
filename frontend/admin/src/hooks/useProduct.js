import { useState, useEffect } from "react";
import axios from "axios";

const useProducts = (
  type,
  page = 1,
  fieldSort = "",
  orderSort = "",
  searchKey = ""
) => {
  const [products, setProducts] = useState([]); // Ensuring products is always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchProducts = async () => {
      let url = "";
      if (type === "request") {
        url = `http://localhost:5555/admin/pending-products?page=${page}`;
      } else if (type === "approved") {
        url = `http://localhost:5555/admin/products?page=${page}`;
      }

      if (fieldSort && orderSort) {
        url += `&sort=${orderSort}&sort=${fieldSort}`;
      }
      if (searchKey) {
        url += `&filter=name&filter=${searchKey}`;
      }

      try {
        setLoading(true);
        setError(null); // Reset error before fetch
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data;

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setProducts([]); // Ensure `products` doesn't become undefined
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [type, page, fieldSort, orderSort, searchKey, refreshTrigger]);

  const approveProducts = async (selectedIds) => {
    try {
      await axios.put(
        "http://localhost:5555/admin/approve-products",
        {
          productIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts((prev) =>
        prev.filter((product) => !selectedIds.includes(product._id))
      );
      alert("Selected products approve successfully!");
      refresh();
    } catch {
      alert("Failed to approve selected products");
    }
  };

  const hideProducts = async (selectedIds) => {
    try {
      await axios.put(
        "http://localhost:5555/admin/hide-products",
        {
          productIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts((prev) =>
        prev.filter((product) => !selectedIds.includes(product._id))
      );
      alert("Selected products hide successfully!");
      refresh();
    } catch {
      alert("Failed to hide selected products.");
    }
  };

  const deleteSelectedProducts = async (selectedIds) => {
    try {
      await axios.delete("http://localhost:5555/admin/delete-products", {
        data: { productIds: selectedIds },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setProducts((prev) =>
        prev.filter((product) => !selectedIds.includes(product._id))
      );
      alert("Selected products deleted successfully!");
      refresh();
    } catch {
      alert("Failed to delete selected products.");
    }
  };

  return {
    products,
    loading,
    error,
    totalPages,
    approveProducts,
    hideProducts,
    deleteSelectedProducts,
  };
};

export default useProducts;
