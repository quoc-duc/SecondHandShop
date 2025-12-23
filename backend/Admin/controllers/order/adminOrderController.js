import {
  getTopSellingProducts,
  getOrderStats,
  getAllOrders,
  updateOrder,
} from "../../services/order/adminOrderService.js";

export const fetchTopSellingProducts = async (req, res) => {
  try {
    const { timeFrame } = req.query; // Lấy timeFrame từ query string
    if (!["day", "week", "month", "year"].includes(timeFrame)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time frame. Allowed values: day, week, month, year.",
      });
    }

    const topProducts = await getTopSellingProducts(timeFrame);
    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchOrderStats = async (req, res) => {
  try {
    const stats = await getOrderStats();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter;

    const result = await getAllOrders(page, limit, sort, filter);
    res.status(200).json({
      success: true,
      totalOrders: result.totalOrders,
      totalPages: result.totalPages,
      limit: result.limit,
      currentPage: result.currentPage,
      orderdetails: result.orderdetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderController = async (req, res) => {
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
