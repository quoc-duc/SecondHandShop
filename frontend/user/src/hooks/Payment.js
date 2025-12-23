import axios from "axios";
import { IP } from "../config";

const createPayment = async (pay) => {
  try {
    const response = await axios.post(`http://${IP}:5555/payments`, pay);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error create payment:", error);
    throw error;
  }
};

export { createPayment };
