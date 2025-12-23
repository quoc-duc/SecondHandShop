import {
  createPayment,
  getPaymentsByOrderId,
  getPaymentsByUserIdPay,
  getPaymentsByUserIdReceive,
} from "../services/paymentService.js";

// Controller để tạo một thanh toán mới
const createPaymentController = async (req, res) => {
  try {
    const paymentData = req.body;
    const newPayment = await createPayment(paymentData);
    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller để lấy các thanh toán theo order_id
const getPaymentsByOrderIdController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payments = await getPaymentsByOrderId(orderId);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller để lấy các thanh toán theo user_id_pay
const getPaymentsByUserIdPayController = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await getPaymentsByUserIdPay(userId);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller để lấy các thanh toán theo user_id_receive
const getPaymentsByUserIdReceiveController = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await getPaymentsByUserIdReceive(userId);
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createPaymentController,
  getPaymentsByOrderIdController,
  getPaymentsByUserIdPayController,
  getPaymentsByUserIdReceiveController,
};
