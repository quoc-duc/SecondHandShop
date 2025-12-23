import OrderDetails from "../../../User/models/OrderDetails.js";
import Products from "../../../User/models/Products.js";
import Orders from "../../../User/models/Orders.js";
import Users from "../../../User/models/Users.js";

// Function to format the total amount in readable units (e.g., trillion, million, etc.)
const formatAmount = (amount) => {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(2)} Tỷ`;
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)} Triệu`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)} Triệu`;
  return amount;
};

export const getOrderStats = async () => {
  try {
    // Aggregate orders to calculate totals
    const stats = await Orders.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalMoney: {
            $sum: {
              $cond: [
                { $eq: ["$status_order", "Success"] }, // Condition to check if status_order is "Success"
                "$total_amount", // Sum total_amount if condition is met
                0, // Otherwise, add 0
              ],
            },
          },
          totalCancelled: {
            $sum: { $cond: [{ $eq: ["$status_order", "Cancelled"] }, 1, 0] },
          },
          totalSuccessful: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status_order", "Success"],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        totalOrders: 0,
        totalMoney: 0,
        totalCancelled: 0,
        totalSuccessful: 0,
      };
    }

    const { totalOrders, totalMoney, totalCancelled, totalSuccessful } =
      stats[0];

    return {
      totalOrders,
      totalMoney: formatAmount(totalMoney),
      totalCancelled,
      totalSuccessful,
    };
  } catch (error) {
    throw new Error(`Error fetching order statistics: ${error.message}`);
  }
};

export const getTopSellingProducts = async (timeFrame) => {
  try {
    // Xác định khoảng thời gian lọc
    let startDate;
    const currentDate = new Date();

    if (timeFrame === "day") {
      startDate = new Date(currentDate.setHours(0, 0, 0, 0)); // Đầu ngày
    } else if (timeFrame === "week") {
      const startOfWeek = currentDate.getDate() - currentDate.getDay();
      startDate = new Date(currentDate.setDate(startOfWeek));
      startDate.setHours(0, 0, 0, 0);
    } else if (timeFrame === "month") {
      startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ); // Đầu tháng
    } else if (timeFrame === "year") {
      startDate = new Date(currentDate.getFullYear(), 0, 1); // Đầu năm
    } else {
      throw new Error("Invalid time frame provided");
    }

    // Lọc đơn hàng theo thời gian
    const topProducts = await OrderDetails.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$product_id",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
    ]);

    // Lấy thông tin chi tiết sản phẩm (tên và ảnh)
    const productIds = topProducts.map((item) => item._id);
    const productDetails = await Products.find({
      _id: { $in: productIds },
    }).select("name image_url");

    // Kết hợp dữ liệu
    const result = topProducts.map((item) => {
      const product = productDetails.find(
        (p) => p._id.toString() === item._id.toString()
      );
      return {
        productId: item._id,
        name: product?.name || "Unknown",
        image_url: product?.image_url || "",
        totalQuantity: item.totalQuantity,
      };
    });

    return result;
  } catch (error) {
    throw new Error(`Error fetching top selling products: ${error.message}`);
  }
};

export const getAllOrders = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = { status: true };
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: query },

      // Convert product_id to ObjectId
      {
        $addFields: {
          product_id: {
            $convert: {
              input: "$product_id",
              to: "objectId",
              onError: "$product_id",
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

      // Convert order_id to ObjectId
      {
        $addFields: {
          order_id: {
            $convert: {
              input: "$order_id",
              to: "objectId",
              onError: "$order_id",
            },
          },
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: { path: "$order", preserveNullAndEmptyArrays: true } },

      // Convert user_id_buyer from order to ObjectId
      {
        $addFields: {
          user_id_buyer: {
            $convert: {
              input: "$order.user_id_buyer",
              to: "objectId",
              onError: "$order.user_id_buyer",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id_buyer",
          foreignField: "_id",
          as: "user_buyer",
        },
      },
      { $unwind: { path: "$user_buyer", preserveNullAndEmptyArrays: true } },

      // Convert user_id_seller from order to ObjectId
      {
        $addFields: {
          user_id_seller: {
            $convert: {
              input: "$order.user_id_seller",
              to: "objectId",
              onError: "$order.user_id_seller",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id_seller",
          foreignField: "_id",
          as: "user_seller",
        },
      },
      { $unwind: { path: "$user_seller", preserveNullAndEmptyArrays: true } },

      // Add display fields
      {
        $addFields: {
          product_name: {
            $ifNull: ["$product.name", ""],
          },
          name_buyer: {
            $ifNull: ["$user_buyer.name", ""],
          },
          phone_buyer: {
            $ifNull: ["$user_buyer.phone", ""],
          },
          address_buyer: {
            $ifNull: ["$user_buyer.address", ""],
          },
          name_seller: {
            $ifNull: ["$user_seller.name", ""],
          },
          phone_seller: {
            $ifNull: ["$user_seller.phone", ""],
          },
          status_order: {
            $ifNull: ["$order.status_order", ""],
          },
          shipping_method: {
            $ifNull: ["$order.shipping_method", ""],
          },
          shipping_cost: {
            $ifNull: ["$order.shipping_cost", ""],
          },
          payment_method: {
            $ifNull: ["$order.payment_method", ""],
          },
          payment_status: {
            $ifNull: ["$order.payment_status", ""],
          },
          note: {
            $ifNull: ["$order.note", ""],
          },
        },
      },

      // Apply filter if any
      ...(filter
        ? [
            {
              $match: {
                [filter[0]]: { $regex: filter[1], $options: "i" },
              },
            },
          ]
        : []),

      // Remove embedded docs
      { $project: { product: 0, user_buyer: 0, user_seller: 0, order: 0 } },

      // Sort
      ...(sort ? [{ $sort: { [sort[1]]: sort[0] === "asc" ? 1 : -1 } }] : []),

      // Pagination
      { $skip: skip },
      { $limit: limit },
    ];

    const orderdetails = await OrderDetails.aggregate(pipeline).exec();
    const totalOrders = await OrderDetails.countDocuments(query).exec();
    const totalPages = Math.ceil(totalOrders / limit);
    return {
      totalOrders,
      totalPages,
      limit,
      skip,
      currentPage: page,
      orderdetails,
    };
  } catch (error) {
    throw new Error(`Error fetching all orders: ${error.message}`);
  }
};

export const updateOrder = async (orderId, updateData) => {
  return await Orders.findByIdAndUpdate(orderId, updateData, { new: true });
};
