import Products from "../../../User/models/Products.js";
import Categories from "../../../User/models/Categories.js";
import Users from "../../../User/models/Users.js";

//----------------Chuyển trạng thái status thành true----------------
const updateProductApproveToTrue = async (productIds) => {
  try {
    const products = await Products.updateMany(
      { _id: { $in: productIds } },
      { approve: true }
    );
    if (products.modifiedCount === 0) {
      throw new Error("No product found or already");
    }
    return products;
  } catch (error) {
    throw new Error("Error updating product approve: " + error.message);
  }
};

//--------------------------------Ẩn sản phẩm--------------------------------
const updateProductApproveToFalse = async (productIds) => {
  try {
    const products = await Products.updateMany(
      { _id: { $in: productIds } },
      { approve: false }
    );
    if (products.modifiedCount === 0) {
      throw new Error("No products found or already");
    }
    return products;
  } catch (error) {
    throw new Error("Error updating product approve: " + error.message);
  }
};

//--------------------------------Xóa sản phẩm checkbox--------------------------------
const deleteProducts = async (productIds) => {
  try {
    const products = await Products.updateMany(
      { _id: { $in: productIds } },
      { status: false }
    );

    if (products.modifiedCount === 0) {
      throw new Error("No products found or already deleted");
    }

    return products;
  } catch (error) {
    throw new Error("Error updating product status: " + error.message);
  }
};

//--------------------------------Lấy sản phẩm đã duyệt--------------------------------
const getProducts = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = { status: true, approve: true };
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          category_id: {
            $convert: {
              input: "$category_id",
              to: "objectId",
              onError: "$category_id",
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          user_id: {
            $convert: {
              input: "$user_id",
              to: "objectId",
              onError: "$user_id",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          category_name: { $ifNull: ["$category.category_name", "Unknown"] },
          username: { $ifNull: ["$user.name", "Unknown"] },
        },
      },

      // Filter được đặt sau khi đã có category_name và username
      ...(filter
        ? [
            {
              $match: {
                [filter[0]]: { $regex: filter[1], $options: "i" },
              },
            },
          ]
        : []),

      { $project: { category: 0, user: 0 } },

      // Sắp xếp nếu có
      ...(sort ? [{ $sort: { [sort[1]]: sort[0] === "asc" ? 1 : -1 } }] : []),

      // Phân trang
      { $skip: skip },
      { $limit: limit },
    ];

    const products = await Products.aggregate(pipeline);

    // Đếm tổng số sản phẩm
    const totalProducts = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      totalProducts,
      totalPages,
      skip,
      limit,
      currentPage: page,
      products,
    };
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

//---------------------------------------------------------------
const getRequestProducts = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = { status: true, approve: false };
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          category_id: {
            $convert: {
              input: "$category_id",
              to: "objectId",
              onError: "$category_id",
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          user_id: {
            $convert: {
              input: "$user_id",
              to: "objectId",
              onError: "$user_id",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          category_name: { $ifNull: ["$category.category_name", "Unknown"] },
          username: { $ifNull: ["$user.name", "Unknown"] },
        },
      },

      // Filter được đặt sau khi đã có category_name và username
      ...(filter
        ? [
            {
              $match: {
                [filter[0]]: { $regex: filter[1], $options: "i" },
              },
            },
          ]
        : []),

      { $project: { category: 0, user: 0 } },

      // Sắp xếp nếu có
      ...(sort ? [{ $sort: { [sort[1]]: sort[0] === "asc" ? 1 : -1 } }] : []),

      // Phân trang
      { $skip: skip },
      { $limit: limit },
    ];

    // Lấy sản phẩm đã xử lý
    const products = await Products.aggregate(pipeline);

    // Đếm tổng số sản phẩm
    const totalProducts = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return {
      totalProducts,
      totalPages,
      skip,
      limit,
      currentPage: page,
      products,
    };
  } catch (error) {
    throw new Error("Error fetching products: " + error.message);
  }
};

export {
  updateProductApproveToTrue,
  getProducts,
  updateProductApproveToFalse,
  deleteProducts,
  getRequestProducts,
};
