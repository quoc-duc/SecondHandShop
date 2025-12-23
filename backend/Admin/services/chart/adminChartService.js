import Users from "../../../User/models/Users.js";
import Products from "../../../User/models/Products.js";
import Orders from "../../../User/models/Orders.js";
import Reviews from "../../../User/models/Reviews.js";

export const getUserStatisticsByYear = async (year) => {
  try {
    // Sử dụng MongoDB aggregation pipeline
    const startOfYear = new Date(year, 0, 1); // 1st Jan of the year
    const endOfYear = new Date(year + 1, 0, 1); // 1st Jan of the next year

    const statistics = await Users.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfYear,
            $lt: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $project: {
          month: "$_id",
          totalUsers: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    // Tạo một mảng kết quả với tất cả 12 tháng, mặc định số lượng người dùng là 0
    const result = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      totalUsers: 0,
    }));

    // Cập nhật số lượng người dùng cho từng tháng trong kết quả
    statistics.forEach((stat) => {
      result[stat.month - 1].totalUsers = stat.totalUsers;
    });

    return result;
  } catch (error) {
    console.error("Error while fetching user statistics by year:", error);
    throw error;
  }
};

//-----------------------------Stat order and product by month --------------------------------------
export const getOrderMonthlyStatistics = async (year) => {
  try {
    // Aggregate products for the specified year with status true and approved true
    const productStats = await Products.aggregate([
      {
        $match: {
          status: true,
          approve: true,
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalProducts: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Aggregate orders for the specified year with status true and order status success
    const orderStats = await Orders.aggregate([
      {
        $match: {
          status: true,
          //status_order: "Success",
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Initialize months from 1 to 12 with default 0 for both products and orders
    const result = [];
    for (let i = 1; i <= 12; i++) {
      const productMonth = productStats.find((stat) => stat._id === i);
      const orderMonth = orderStats.find((stat) => stat._id === i);

      result.push({
        month: i,
        totalProducts: productMonth ? productMonth.totalProducts : 0,
        totalOrders: orderMonth ? orderMonth.totalOrders : 0,
      });
    }

    return result;
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};

//----------------------------Stat order status-----------------------------------
export const getOrderStatusStats = async () => {
  const totalOrders = await Orders.countDocuments();

  if (totalOrders === 0) return [];

  const result = await Orders.aggregate([
    {
      $group: {
        _id: "$status_order",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
        percentage: {
          $multiply: [{ $divide: ["$count", totalOrders] }, 100],
        },
      },
    },
  ]);

  // Làm tròn phần trăm đến 2 chữ số sau dấu phẩy
  const roundedResult = result.map((item) => ({
    status: item.status,
    count: item.count,
    percentage: Math.round(item.percentage * 100) / 100,
  }));

  return roundedResult;
};

//----------------------------Rating review-----------------------------------
export const getRatingDistribution = async () => {
  // Aggregate ratings from 1 to 5
  const result = await Reviews.aggregate([
    { $match: { status: true } }, // Lọc đánh giá hợp lệ
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 }, // Sắp xếp theo rating (1 đến 5 sao)
    },
  ]);

  // Tính tổng số đánh giá
  const total = result.reduce((acc, item) => acc + item.count, 0);

  // Tính phần trăm mỗi loại rating
  const percentage = {};
  for (let i = 1; i <= 5; i++) {
    const found = result.find((r) => r._id === i);
    const count = found ? found.count : 0;
    percentage[i] = total ? ((count / total) * 100).toFixed(2) : 0;
  }

  return percentage;
};

//--------------------------Top user buy product-----------------------------------
export const getTopUserOrder = async (month, year) => {
  const matchStage = {
    user_id_seller: { $ne: "" },
  };

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    matchStage.createdAt = { $gte: startDate, $lt: endDate };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: "$user_id_seller",
        orderCount: { $sum: 1 },
      },
    },
    {
      $sort: { orderCount: -1 },
    },
    {
      $limit: 10,
    },
  ];

  const result = await Orders.aggregate(pipeline);

  for (const seller of result) {
    const user = await Users.findById(seller._id).select("username name");
    seller.username = user?.username || "Unknown";
    seller.name = user?.name || "";
  }

  return result;
};

//------------------------Top user post product-----------------------------------
export const getTopUserPost = async (month, year) => {
  const matchStage = {
    status: true,
    approve: true,
  };

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    matchStage.createdAt = { $gte: startDate, $lt: endDate };
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: "$user_id",
        productCount: { $sum: 1 },
      },
    },
    { $sort: { productCount: -1 } },
    { $limit: 10 },
  ];

  const result = await Products.aggregate(pipeline);

  for (const item of result) {
    const user = await Users.findById(item._id).select("username name");
    item.username = user?.username || "Unknown";
    item.name = user?.name || "";
  }

  return result;
};
