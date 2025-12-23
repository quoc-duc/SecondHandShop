import Orders from '../models/Orders.js';

// Tạo một đơn hàng mới
const createOrder = async (orderData) => {
    const order = new Orders(orderData);
    return await order.save();
};

// Lấy tất cả các đơn hàng còn hiệu lực
const getAllOrders = async () => {
    return await Orders.find({ status: true });
};

// Lấy đơn hàng theo ID
const getOrderById = async (orderId) => {
    return await Orders.findOne({ _id: orderId, status: true });
};

// Lấy các đơn hàng theo user_id_buyer
const getOrdersByUserIdBuyer = async (userIdBuyer) => {
    return await Orders.find({ user_id_buyer: userIdBuyer, status: true });
};

const getOrdersByUserIdBuyer1 = async (userIdBuyer, page, limit) => {
    const skip = (page - 1) * limit;
    const orders = await Orders.find({ user_id_buyer: userIdBuyer, status: true }).skip(skip).limit(limit);
    const total = await Orders.countDocuments({ user_id_buyer: userIdBuyer, status: true });
  
    return {
        orders,
        totalPages: Math.ceil(total / limit),
    };
};

// Lấy các đơn hàng theo user_id_seller
const getOrdersByUserIdSeller = async (userIdSeller) => {
    return await Orders.find({ user_id_seller: userIdSeller, status: true });
};

const getOrdersByUserIdSeller1 = async (userIdSeller, page, limit) => {
    const skip = (page - 1) * limit;
    const orders = await Orders.find({ user_id_seller: userIdSeller, status: true }).skip(skip).limit(limit);
    const total = await Orders.countDocuments({ user_id_seller: userIdSeller, status: true });
  
    return {
        orders,
        totalPages: Math.ceil(total / limit),
    };
};

// Lấy các đơn hàng theo số điện thoại
const getOrdersByPhone = async (phone) => {
    return await Orders.find({ phone: phone, status: true });
};

// Lấy các đơn hàng theo trạng thái đơn hàng
const getOrdersByStatusOrder = async (statusOrder) => {
    return await Orders.find({ status_order: statusOrder, status: true });
};

// Cập nhật thông tin đơn hàng
const updateOrder = async (orderId, updateData) => {
    return await Orders.findByIdAndUpdate(orderId, updateData, { new: true });
};

// Xóa đơn hàng (đánh dấu là không hợp lệ)
const deleteOrder = async (orderId) => {
    return await Orders.findByIdAndUpdate(
        orderId,
        { status: false },
        { new: true }
    );
};

export {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUserIdBuyer,
    getOrdersByUserIdBuyer1,
    getOrdersByUserIdSeller,
    getOrdersByUserIdSeller1,
    getOrdersByPhone,
    getOrdersByStatusOrder,
    updateOrder,
    deleteOrder
};