import {
  getUserStatisticsByYear,
  getOrderMonthlyStatistics,
  getOrderStatusStats,
  getRatingDistribution,
  getTopUserPost,
  getTopUserOrder,
} from "../../services/chart/adminChartService.js";

export const getUserStatistics = async (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ message: "Year is required" });
  }

  try {
    const statistics = await getUserStatisticsByYear(Number(year));
    return res.status(200).json(statistics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user statistics" });
  }
};

// Controller to handle the request and return statistics
export const getOrderStatisticsByYear = async (req, res) => {
  try {
    const { year } = req.query; // Extract year from query parameters
    if (!year) {
      return res.status(400).json({ message: "Year parameter is required" });
    }

    const statistics = await getOrderMonthlyStatistics(parseInt(year));

    res.status(200).json(statistics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching statistics", error: error.message });
  }
};

//-----------------------------Stat order status --------------------------------------
export const getOrderStatusChart = async (req, res) => {
  try {
    const stats = await getOrderStatusStats();
    res.status(200).json(stats);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy thống kê trạng thái đơn hàng", error });
  }
};

//-----------------------------Stat rating review --------------------------------------
export const getRatingPieChart = async (req, res) => {
  try {
    const data = await getRatingDistribution();
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error getting rating distribution:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//----------------------- Top user post product--------------------------------------
export const getTopUserPostProduct = async (req, res) => {
  try {
    const { month, year } = req.query;

    const numericMonth = parseInt(month);
    const numericYear = parseInt(year);

    if (isNaN(numericMonth) || isNaN(numericYear)) {
      return res.status(400).json({ message: "Invalid month or year" });
    }

    const data = await getTopUserPost(numericMonth, numericYear);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getTopSellersMonthly:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//-----------------------  Top order-product --------------------------------------
export const getTopBuyer = async (req, res) => {
  try {
    const { month, year } = req.query;

    const numericMonth = parseInt(month);
    const numericYear = parseInt(year);

    if (isNaN(numericMonth) || isNaN(numericYear)) {
      return res.status(400).json({ message: "Invalid month or year" });
    }

    const data = await getTopUserOrder(numericMonth, numericYear);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error in getTopProductSellers:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
