import {
    createOrderDetail,
    getAllOrderDetails,
    getOrderDetailsByOrderId,
    getOrderDetailsByProductId,
    updateOrderDetail,
    deleteOrderDetail
} from '../services/orderDetailService.js';

// Tạo chi tiết đơn hàng
const createOrderDetailController = async (req, res) => {
    try {
        const orderDetailData = req.body; // Lấy dữ liệu chi tiết đơn hàng từ body
        const newOrderDetail = await createOrderDetail(orderDetailData);
        res.status(201).json({ success: true, data: newOrderDetail });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy tất cả chi tiết đơn hàng
const getAllOrderDetailsController = async (req, res) => {
    try {
        const orderDetails = await getAllOrderDetails();
        res.status(200).json({ success: true, data: orderDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy chi tiết đơn hàng theo order_id
const getOrderDetailsByOrderIdController = async (req, res) => {
    try {
        const { orderId } = req.params; // Lấy orderId từ params
        const orderDetails = await getOrderDetailsByOrderId(orderId);
        res.status(200).json({ success: true, data: orderDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Lấy chi tiết đơn hàng theo product_id
const getOrderDetailsByProductIdController = async (req, res) => {
    try {
        const { productId } = req.params; // Lấy productId từ params
        const orderDetails = await getOrderDetailsByProductId(productId);
        res.status(200).json({ success: true, data: orderDetails });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Cập nhật chi tiết đơn hàng
const updateOrderDetailController = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ params
        const updateData = req.body; // Lấy dữ liệu cập nhật từ body
        const updatedOrderDetail = await updateOrderDetail(id, updateData);
        if (!updatedOrderDetail) {
            return res.status(404).json({ success: false, message: "Order detail not found." });
        }
        res.status(200).json({ success: true, data: updatedOrderDetail });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// "Xóa" chi tiết đơn hàng
const deleteOrderDetailController = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ params
        const deletedOrderDetail = await deleteOrderDetail(id);
        if (!deletedOrderDetail) {
            return res.status(404).json({ success: false, message: "Order detail not found." });
        }
        res.status(200).json({ success: true, message: "Order detail deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    createOrderDetailController,
    getAllOrderDetailsController,
    getOrderDetailsByOrderIdController,
    getOrderDetailsByProductIdController,
    updateOrderDetailController,
    deleteOrderDetailController
};