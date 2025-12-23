import axios from "axios";
import { useEffect, useState } from "react";
import { IP } from "../config";

const updateProfile = async (id, info) => {
  try {
    const response = await axios.put(`http://${IP}:5555/users/${id}`, info, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.error("Server responded with error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response received:", error.request);
    } else {
      // Error setting up the request
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

const useUserById = (id) => {
  const [sellerInfo, setSellerInfo] = useState([]);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get(`http://${IP}:5555/users/${id}`);
        setSellerInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Có thể xử lý lỗi ở đây nếu cần
      }
    };

    fetchSellerInfo();
  }, [id]);
  return sellerInfo;
};

const useLocationAddress = (provinceId) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          "https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1"
        );
        setProvinces(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (provinceId) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            `https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${provinceId}`
          );
          setDistricts(response.data.data);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [provinceId]);

  return { provinces, districts };
};

const useUsersByIds = (ids) => {
  const [usersInfo, setUsersInfo] = useState([]);

  useEffect(() => {
    const fetchUsersInfo = async () => {
      try {
        const responses = await Promise.all(
          ids.map((id) =>
            axios.get(`http://${IP}:5555/users/${id}`).then((res) => res.data)
          )
        );
        setUsersInfo(responses);
      } catch (error) {
        console.error("Error fetching users data:", error);
      }
    };

    if (ids.length > 0) {
      fetchUsersInfo();
    } else {
      setUsersInfo([]);
    }
  }, [ids]);

  return usersInfo;
};

export { updateProfile, useUserById, useLocationAddress, useUsersByIds };
