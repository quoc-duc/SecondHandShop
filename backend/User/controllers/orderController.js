import {
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
  deleteOrder,
} from "../services/orderService.js";

// Tạo đơn hàng
const createOrderController = async (req, res) => {
  try {
    const orderData = req.body; // Lấy dữ liệu đơn hàng từ body
    const newOrder = await createOrder(orderData);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy tất cả đơn hàng
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy đơn hàng theo ID
const getOrderByIdController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ params
    const order = await getOrderById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy đơn hàng theo userId (người mua)
const getOrdersByUserIdBuyerController = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ params
    const orders = await getOrdersByUserIdBuyer(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrdersByUserIdBuyerController1 = async (req, res) => {
  const { userId } = req.query; // Thay đổi ở đây
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
    try {
        const { orders, totalPages } = await getOrdersByUserIdBuyer1(userId, page, limit);
        res.status(200).json({
            data: orders,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy đơn hàng theo userId (người bán)
const getOrdersByUserIdSellerController = async (req, res) => {
  try {
    const { userId } = req.params; // Lấy userId từ params
    const orders = await getOrdersByUserIdSeller(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrdersByUserIdSellerController1 = async (req, res) => {
  const { userId } = req.query; // Thay đổi ở đây
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const { orders, totalPages } = await getOrdersByUserIdSeller1(
      userId,
      page,
      limit
    );
    res.status(200).json({
      data: orders,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy đơn hàng theo số điện thoại
const getOrdersByPhoneController = async (req, res) => {
  try {
    const { phone } = req.params; // Lấy phone từ params
    const orders = await getOrdersByPhone(phone);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy đơn hàng theo trạng thái
const getOrdersByStatusOrderController = async (req, res) => {
  try {
    const { status } = req.params; // Lấy status từ params
    const orders = await getOrdersByStatusOrder(status);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật đơn hàng
const updateOrderController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ params
    const updateData = req.body; // Lấy dữ liệu cập nhật từ body
    const updatedOrder = await updateOrder(id, updateData);
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa đơn hàng
const deleteOrderController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID từ params
    const deletedOrder = await deleteOrder(id);
    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }
    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xuất tất cả các controller
export {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByUserIdBuyerController,
  getOrdersByUserIdBuyerController1,
  getOrdersByUserIdSellerController,
  getOrdersByUserIdSellerController1,
  getOrdersByPhoneController,
  getOrdersByStatusOrderController,
  updateOrderController,
  deleteOrderController,
};
