import Payments from "../models/Payments.js";

// Tạo một thanh toán mới
const createPayment = async (paymentData) => {
  const payment = new Payments(paymentData);
  return await payment.save();
};

// Lấy tất cả các thanh toán còn hiệu lực
const getAllPayments = async () => {
  return await Payments.find({ status: true });
};

// Lấy thanh toán theo order_id
const getPaymentsByOrderId = async (orderId) => {
  return await Payments.find({ order_id: orderId, status: true });
};

// Xóa thanh toán (đánh dấu là không hợp lệ)
const deletePayment = async (paymentId) => {
  return await Payments.findByIdAndUpdate(
    paymentId,
    { status: false },
    { new: true }
  );
};

// Lấy các thanh toán theo user_id_pay
const getPaymentsByUserIdPay = async (userIdPay) => {
  return await Payments.find({ user_id_pay: userIdPay, status: true });
};

// Lấy các thanh toán theo user_id_receive
const getPaymentsByUserIdReceive = async (userIdReceive) => {
  return await Payments.find({ user_id_receive: userIdReceive, status: true });
};

export {
  createPayment,
  //getAllPayments,
  getPaymentsByOrderId,
  //deletePayment,
  getPaymentsByUserIdPay,
  getPaymentsByUserIdReceive,
};
