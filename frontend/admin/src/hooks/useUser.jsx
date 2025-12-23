import { useEffect, useState } from "react";
import axios from "axios";

const useUser = (
  type,
  page = 1,
  fieldSort = "",
  orderSort = "",
  searchKey = ""
) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBans, setTotalBans] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refresh = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchUsers = async () => {
      let url = "";
      if (type === "users") {
        url = `http://localhost:5555/admin/all-users?page=${page}`;
      } else if (type === "banned") {
        url = `http://localhost:5555/admin/all-banner?page=${page}`;
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

        if (data.success && Array.isArray(data.users)) {
          setUsers(data.users);
          setTotalPages(data.totalPages || 1);
          setTotalUsers(data.totalUsers || 0);
          setTotalBans(data.totalBans || 0);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [type, page, fieldSort, orderSort, searchKey, refreshTrigger]);

  // Ban user
  const banUser = async (selectedIds) => {
    try {
      await axios.put(
        "http://localhost:5555/admin/ban-user",
        {
          userIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers((prev) =>
        prev.filter((user) => !selectedIds.includes(user._id))
      );
      alert("Selected users banned successfully");
      refresh();
    } catch {
      alert("Failed to ban selected users");
    }
  };

  // Unban user
  const unbanUser = async (selectedIds) => {
    try {
      await axios.put(
        "http://localhost:5555/admin/unban-user",
        {
          userIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsers((prev) =>
        prev.filter((user) => !selectedIds.includes(user._id))
      );
      alert("Selected users unbanned successfully");
      refresh();
    } catch {
      alert("Failed to unban selected users");
    }
  };

  // Delete users
  const deleteUsers = async (selectedIds) => {
    try {
      await axios.delete("http://localhost:5555/admin/delete-account", {
        data: { userIds: selectedIds },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers((prev) =>
        prev.filter((user) => !selectedIds.includes(user._id))
      );
      alert("Selected users deleted successfully");
      refresh();
    } catch {
      alert("Failed to delete selected users.");
    }
  };

  return {
    users,
    loading,
    error,
    totalPages,
    totalUsers,
    totalBans,
    banUser,
    unbanUser,
    deleteUsers,
  };
};

export default useUser;
