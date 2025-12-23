import Users from "../../../User/models/Users.js";
import Products from "../../../User/models/Products.js";
import Orders from "../../../User/models/Orders.js";
import Reviews from "../../../User/models/Reviews.js";
import Feedbacks from "../../../User/models/Feedbacks.js";
import Notifications from "../../../User/models/Notifications.js";

//--------------------------------Lấy tất cả người dùng trừ admin--------------------------------
const getAllUsersExcludingRole = async (
  excludedRole,
  page = 1,
  limit = 10,
  sort,
  filter
) => {
  try {
    const query = { status: true, role: { $ne: excludedRole }, ban: false };
    const skip = (page - 1) * limit;

    if (filter) {
      const label = filter[0];
      const value = filter[1];
      query[label] = { $regex: value, $options: "i" };
      const filterusers = await Users.find(query)
        .skip(skip)
        .limit(limit)
        .lean();
      const totalUsers = await Users.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / limit);
      return {
        totalUsers,
        totalPages,
        skip,
        limit,
        currentPage: page,
        users: filterusers,
      };
    }

    const totalUsers = await Users.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    if (sort) {
      const objectSort = {};
      objectSort[sort[1]] = sort[0];
      const sortUsers = await Users.find(query)
        .skip(skip)
        .limit(limit)
        .sort(objectSort)
        .lean();

      return {
        totalUsers,
        totalPages,
        skip,
        limit,
        currentPage: page,
        users: sortUsers,
      };
    }
    const users = await Users.find(query).skip(skip).limit(limit).lean();

    return {
      totalUsers,
      totalPages,
      skip,
      limit,
      currentPage: page,
      users,
    };
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

//--------------------------------Lấy tất cả người dùng đang có role là....--------------------------------
const getUsersByRole = async (role, page = 1, limit = 10, sort, filter) => {
  try {
    const query = { role, status: true };
    const skip = (page - 1) * limit;
    if (filter) {
      const label = filter[0];
      const value = filter[1];
      query[label] = { $regex: value, $options: "i" };
      const totalUsers = await Users.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / limit);
      const filterUsers = await Users.find(query)
        .skip(skip)
        .limit(limit)
        .lean();
      return {
        success: true,
        totalUsers,
        totalPages,
        skip,
        limit,
        currentPage: page,
        users: filterUsers,
      };
    }

    const totalUsers = await Users.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    if (sort) {
      const objectSort = {};
      objectSort[sort[1]] = sort[0];
      const sortUsers = await Users.find(query)
        .skip(skip)
        .limit(limit)
        .sort(objectSort)
        .lean();
      return {
        success: true,
        totalUsers,
        totalPages,
        skip,
        limit,
        currentPage: page,
        users: sortUsers,
      };
    }
    const users = await Users.find(query).skip(skip).limit(limit).lean();

    return {
      success: true,
      totalUsers,
      totalPages,
      skip,
      limit,
      currentPage: page,
      users,
    };
  } catch (error) {
    throw new Error("Error fetching users: " + error.message);
  }
};

//--------------------------------Lấy tất cả người dùng bị ban--------------------------------
const getBannedUsers = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = { ban: true, status: true };
    const skip = (page - 1) * limit;
    const totalUsers = await Users.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    if (filter) {
      const label = filter[0];
      const value = filter[1];
      query[label] = { $regex: value, $options: "i" };
      const filterUsers = await Users.find(query)
        .skip(skip)
        .limit(limit)
        .lean();
      return {
        totalUsers,
        totalPages,
        limit,
        currentPage: page,
        users: filterUsers,
      };
    }

    if (sort) {
      const objectSort = {};
      objectSort[sort[1]] = sort[0];
      const sortUsers = await Users.find(query)
        .skip(skip)
        .limit(limit)
        .sort(objectSort)
        .lean();
      return {
        totalUsers,
        totalPages,
        limit,
        currentPage: page,
        users: sortUsers,
      };
    }
    const users = await Users.find(query).skip(skip).limit(limit).lean();

    return {
      totalUsers,
      totalPages,
      limit,
      currentPage: page,
      users,
    };
  } catch (error) {
    throw new Error("Error fetching banned users: " + error.message);
  }
};

//--------------------------------Ban người dùng--------------------------------
const banUser = async (userIds) => {
  try {
    const users = await Users.updateMany(
      { _id: { $in: userIds } },
      { ban: true }
    );
    if (users.modifiedCount === 0) throw new Error("No users found or already");

    return users;
  } catch (error) {
    throw new Error("Error banning user: " + error.message);
  }
};

//--------------------------------Unban người dùng--------------------------------
const unbanUser = async (userIds) => {
  try {
    const users = await Users.updateMany(
      { _id: { $in: userIds } },
      { ban: false }
    );

    if (users.modifiedCount === 0) {
      throw new Error("No users found or already unban");
    }

    return users;
  } catch (error) {
    throw new Error("Error unban user: " + error.message);
  }
};

//--------------------------------Xóa tạm người dùng--------------------------------
const deleteUser = async (userIds) => {
  try {
    const users = await Users.updateMany(
      { _id: { $in: userIds } },
      { status: false }
    );

    if (users.modifiedCount === 0) {
      throw new Error("No users found or already deleted");
    }
    return users;
  } catch (error) {
    throw new Error("Error updating user status: " + error.message);
  }
};

//--------------------------------Tìm kiếm người dùng theo từ khóa--------------------------------
const searchUsers = async (keyword) => {
  try {
    const regex = new RegExp(keyword, "i"); // Tạo regex để tìm kiếm không phân biệt hoa thường
    const query = {
      $or: [
        { name: regex },
        { email: regex },
        // Nếu từ khóa là số hợp lệ, tìm trên trường phone
        ...(isNaN(Number(keyword)) ? [] : [{ phone: keyword }]),
      ],
      status: true, // Chỉ lấy người dùng đang hoạt động
    };

    const users = await Users.find(query).select("name email phone address"); // Chỉ lấy các trường cần thiết
    return users;
  } catch (error) {
    throw new Error("Error searching users: " + error.message);
  }
};

//--------------------------------Chuyển role giữa regisPartner và partner và user--------------------------------
// const switchRole = async (userId, currentRole, newRole) => {
//   try {
//     const user = await Users.findById(userId);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     if (user.role !== currentRole) {
//       throw new Error(`User is not in role: ${currentRole}`);
//     }

//     // Cập nhật role mới
//     user.role = newRole;
//     await user.save();
//     return user;
//   } catch (error) {
//     throw new Error("Error switching user role: " + error.message);
//   }
// };

const switchRole = async (userIds, currenRole, newRole) => {
  try {
    const users = await Users.updateMany(
      { _id: { $in: userIds }, role: currenRole, status: true },
      { $set: { role: newRole } }
    );

    if (users.modifiedCount === 0) {
      throw new Error("No users found or already switch");
    }
    return users;
  } catch (error) {
    throw new Error("Error switch user role: " + error.message);
  }
};

export {
  getAllUsersExcludingRole,
  getUsersByRole,
  deleteUser,
  getBannedUsers,
  unbanUser,
  banUser,
  searchUsers,
  switchRole,
};
