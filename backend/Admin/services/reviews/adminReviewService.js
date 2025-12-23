import Users from "../../../User/models/Users.js";
import Reviews from "../../../User/models/Reviews.js";
import Products from "../../../User/models/Products.js";

//----------------------Lấy tất cả Reviews---------------------------
// const getAllReviews = async (page = 1, limit = 10, sort, filter) => {
//   try {
//     const query = { status: true };
//     const skip = (page - 1) * limit;

//     if (filter) {
//       const label = filter[0];
//       const value = filter[1];
//       query[label] = { $regex: value, $options: "i" };
//       const filterReviews = await Reviews.find(query)
//         .skip(skip)
//         .limit(limit)
//         .lean();
//       const totalReviews = await Reviews.countDocuments(query);
//       const totalPages = Math.ceil(totalReviews / limit);
//       return {
//         totalReviews,
//         totalPages,
//         limit,
//         currentPage: page,
//         reviewDetails: filterReviews,
//       };
//     }

//     const totalReviews = await Reviews.countDocuments(query);
//     const totalPages = Math.ceil(totalReviews / limit);

//     if (sort) {
//       const objectSort = {};
//       objectSort[sort[1]] = sort[0];
//       const sortReviews = await Reviews.find(query)
//         .skip(skip)
//         .limit(limit)
//         .sort(objectSort)
//         .lean();

//       for (const review of sortReviews) {
//         const user = await Users.findById(review.user_id).lean();
//         const product = await Products.findById(review.product_id).lean();

//         review.username = user?.name || "Unknown";
//         review.product_name = product?.name || "Unknown";
//         review.product_image = product?.image_url || "Unknown";
//       }

//       return {
//         totalReviews,
//         totalPages,
//         limit,
//         currentPage: page,
//         reviewDetails: sortReviews,
//       };
//     }
//     const reviewDetails = await Reviews.find(query)
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     for (const review of reviewDetails) {
//       const user = await Users.findById(review.user_id).lean();
//       const product = await Products.findById(review.product_id).lean();

//       review.username = user?.name || "Unknown";
//       review.product_name = product?.name || "Unknown";
//       review.product_image = product?.image_url || "Unknown";
//     }

//     return {
//       reviewDetails,
//       totalReviews,
//       totalPages,
//       limit,
//       currentPage: page,
//     };
//   } catch (error) {
//     throw new Error("Error fetching review: " + error.message);
//   }
// };
const getAllReviews = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = { status: true };
    const skip = (page - 1) * limit;
    const pipeline = [
      { $match: query },
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
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          username: {
            $ifNull: ["$user.name", "Unknown User"],
          },
          product_name: {
            $ifNull: ["$product.name", "Unknown Product"],
          },
          product_image: {
            $ifNull: ["$product.image_url", "Unknown Image"],
          },
        },
      },
      ...(filter
        ? [
            {
              $match: {
                [filter[0]]: {
                  $regex: filter[1],
                  $options: "i",
                },
              },
            },
          ]
        : []),
      { $project: { user: 0, product: 0 } },

      ...(sort ? [{ $sort: { [sort[1]]: sort[0] === "asc" ? 1 : -1 } }] : []),
      { $skip: skip },
      { $limit: limit },
    ];
    const reviewDetails = await Reviews.aggregate(pipeline);
    const totalReviews = await Reviews.countDocuments(query);
    const totalPages = Math.ceil(totalReviews / limit);
    return {
      reviewDetails,
      totalReviews,
      totalPages,
      limit,
      currentPage: page,
    };
  } catch (error) {
    throw new Error("Error fetching reviews: " + error.message);
  }
};

//----------------------Xóa Reviews---------------------------
const deleteReview = async (reviewIds) => {
  try {
    const reviews = await Reviews.updateMany(
      { _id: { $in: reviewIds } },
      { status: false }
    );

    if (reviews.modifiedCount === 0) {
      throw new Error("No reviews found or already");
    }

    return reviews;
  } catch (error) {
    throw new Error("Error updating review status: " + error.message);
  }
};

export { getAllReviews, deleteReview };
