import axios from "axios";

export const createVNPayPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      "http://localhost:5555/admin/create_payment_url",
      {
        amount: paymentData.amount,
        orderDescription: paymentData.orderDescription,
        orderType: "other",
        language: "vn",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating VNPay payment:", error);
    throw error;
  }
};

export const checkVNPayPayment = async (queryParams) => {
  try {
    const response = await axios.get(
      "http://localhost:5555/admin/check-payment-vnpay",
      {
        params: queryParams,
      }
    );
    console.log("checkVNPayPayment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking VNPay payment:", error);
    throw error;
  }
};
