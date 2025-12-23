import OrderDetails from '../models/OrderDetails.js';

// Tạo một chi tiết đơn hàng mới
const createOrderDetail = async (orderDetailData) => {
    const orderDetail = new OrderDetails(orderDetailData);
    return await orderDetail.save();
};

// Lấy tất cả các chi tiết đơn hàng còn hiệu lực
const getAllOrderDetails = async () => {
    return await OrderDetails.find({ status: true });
};

// Lấy chi tiết đơn hàng theo order_id
const getOrderDetailsByOrderId = async (orderId) => {
    return await OrderDetails.find({ order_id: orderId, status: true });
};

// Lấy chi tiết đơn hàng theo product_id
const getOrderDetailsByProductId = async (productId) => {
    return await OrderDetails.find({ product_id: productId, status: true });
};

// Cập nhật chi tiết đơn hàng
const updateOrderDetail = async (orderDetailId, updateData) => {
    return await OrderDetails.findByIdAndUpdate(orderDetailId, updateData, { new: true });
};

// "Xóa" chi tiết đơn hàng (đánh dấu là không hợp lệ)
const deleteOrderDetail = async (orderDetailId) => {
    return await OrderDetails.findByIdAndUpdate(
        orderDetailId,
        { status: false },
        { new: true }
    );
};

export {
    createOrderDetail,
    getAllOrderDetails,
    getOrderDetailsByOrderId,
    getOrderDetailsByProductId,
    updateOrderDetail,
    deleteOrderDetail
};