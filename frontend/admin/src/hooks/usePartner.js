import { useState, useEffect } from "react";
import axios from "axios";

const usePartners = (
  type,
  page = 1,
  fieldSort = "",
  orderSort = "",
  searchKey = ""
) => {
  const [partners, setPartners] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartners = async () => {
      let url = "";
      if (type === "partner") {
        url = `http://localhost:5555/admin/all-partners?page=${page}`;
      } else if (type === "regispartner") {
        url = `http://localhost:5555/admin/all-requestpartners?page=${page}`;
      }
      if (fieldSort && orderSort) {
        url += `&sort=${orderSort}&sort=${fieldSort}`;
      }

      if (searchKey) {
        url += `&filter=name&filter=${searchKey}`;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = response.data;

        if (data.success && Array.isArray(data.partners)) {
          setPartners(data.partners);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [type, page, fieldSort, orderSort, searchKey]);

  // Function to approve a partner
  const approvePartner = async (selectedIds) => {
    try {
      await axios.put(
        `http://localhost:5555/admin/approve-partner`,
        {
          userIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPartners((prev) =>
        prev.filter((partner) => !selectedIds.includes(partner._id))
      );
      alert("Selected regispartner approve successfully");
    } catch {
      alert("Failed to approve the Partner.");
    }
  };

  // Function to deny a partner
  const denyPartner = async (selectedIds) => {
    try {
      await axios.put(
        `http://localhost:5555/admin/switch-to-user`,
        {
          userIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPartners((prev) =>
        prev.filter((partner) => !selectedIds.includes(partner._id))
      );
      alert("Deny partner successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePartner = async (selectedIds) => {
    try {
      await axios.delete(
        `http://localhost:5555/admin/delete-role-partner`,
        {
          userIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPartners((prev) =>
        prev.filter((partner) => !selectedIds.includes(partner._id))
      );
      alert("Selected partner delete successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    partners,
    loading,
    error,
    totalPages,
    approvePartner,
    denyPartner,
    deletePartner,
  };
};

export default usePartners;
