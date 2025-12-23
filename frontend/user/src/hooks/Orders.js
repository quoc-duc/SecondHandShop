import axios from "axios";
import { IP } from "../config";

const createOrder = async (info) => {
  try {
    const response = await axios.post(`http://${IP}:5555/orders`, info);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching cart items:", error);
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
  }
};

const updateStatusOrder = async (id, status_order) => {
  try {
    const response = await axios.put(`http://${IP}:5555/orders/${id}`, {
      status_order,
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error update product:", error);
    throw error;
  }
};

const updateOrder = async (id, order) => {
  try {
    const response = await axios.put(`http://${IP}:5555/orders/${id}`, order);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error update product:", error);
    throw error;
  }
};

export { createOrder, updateStatusOrder, updateOrder };
