import {
  getAllUsersExcludingRole,
  getUsersByRole,
  deleteUser,
  getBannedUsers,
  banUser,
  unbanUser,
  searchUsers,
  switchRole,
} from "../../services/user/adminUserService.js";

//----------------Lấy tất cả người dùng trừ admin----------------
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter || null;
    const result = await getAllUsersExcludingRole(
      "admin",
      page,
      limit,
      sort,
      filter
    );

    res.status(200).json({
      success: true,
      totalUsers: result.totalUsers,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      skip: result.skip,
      users: result.users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------Lấy tất cả người dùng bị ban----------------
const getAllBannedUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter || null;
    const result = await getBannedUsers(page, limit, sort, filter);

    res.status(200).json({
      success: true,
      totalBans: result.totalUsers,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      skip: result.skip,
      users: result.users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//--------------------Lấy tất cả người dùng đang có role là partner--------------------
const getUsersWithPartnerRole = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await getUsersByRole("partner", page, limit);
    res.status(200).json({
      success: true,
      totalPartners: result.totalUsers,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      skip: result.skip,
      partners: result.users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      messge: error.message,
    });
  }
};

//-----------------Lấy tất cả người dùng yêu cầu làm partner-------------------------------
const getUsersWithRequestPartner = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter || null;
    const result = await getUsersByRole(
      "regisPartner",
      page,
      limit,
      sort,
      filter
    );
    res.status(200).json({
      success: true,
      totalRegisPartners: result.totalUsers,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      skip: result.skip,
      partners: result.users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//------------------------Ban người dùng------------------------
const banUserAccount = async (req, res) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    return res.status(400).json({ message: "No user IDs" });
  }
  try {
    const banUsers = await banUser(userIds);
    res.status(200).json({
      message: "Users ban successfully",
      banCount: banUsers.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to ban user",
      error: error.message,
    });
  }
};

//------------------------Unban người dùng------------------------
const unbanUserAccount = async (req, res) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    return res.status(400).json({ message: "No user IDs" });
  }

  try {
    const unbanUsers = await unbanUser(userIds);
    res.status(200).json({
      message: "Users unban successfully",
      unbanCount: unbanUsers.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to unban users",
      error: error.message,
    });
  }
};

//------------------------Xóa tạm người dùng------------------------
const deleteUserAccount = async (req, res) => {
  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    return res.status(400).json({ message: " No user IDs provided" });
  }
  try {
    const deleteUsers = await deleteUser(userIds);
    res.status(200).json({
      message: "Users deleted successfully",
      deletedCount: deleteUsers.modifiedCount,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete users",
      error: error.meaage,
    });
  }
};

//------------------------Tìm kiếm người dùng theo từ khóa------------------------
const searchUsersByKeyword = async (req, res) => {
  try {
    const { keyword } = req.query; // Lấy từ khóa từ query
    if (!keyword) {
      return res.status(400).json({ message: "Keyword is required" });
    }

    const users = await searchUsers(keyword);

    res.status(200).json({
      totalResults: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//------------------------Chuyển từ regisPartner sang partner------------------------
const switchToPartner = async (req, res) => {
  // try {
  //   const { userId } = req.params; // Lấy userId từ params
  //   const updatedUser = await switchRole(userId, "regisPartner", "partner");

  //   res.status(200).json({
  //     message: "User role changed to 'partner' successfully",
  //     user: updatedUser,
  //   });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }

  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    return res.status(400).json({ message: "No user to do" });
  }

  try {
    const roleToPartner = await switchRole(userIds, "regisPartner", "partner");
    res.status(200).json({
      message: "Update role to partner successfully",
      userToPartnerCount: roleToPartner.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve partners role",
      error: error.message,
    });
  }
};

//------------------------Chuyển từ partner sang user------------------------
const switchPartnerToUser = async (req, res) => {
  // try {
  //   const { userId } = req.params; // Lấy userId từ params
  //   const updatedUser = await switchRole(userId, "partner", "user");

  //   res.status(200).json({
  //     message: "User role changed to 'user' successfully",
  //     user: updatedUser,
  //   });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }

  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    throw new Error("No user found or already");
  }
  try {
    const roleToUsers = await switchRole(userIds, "partner", "user");
    res.status(200).json({
      message: "Update role to user successully",
      userRoleToUser: roleToUsers.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update role to user",
      error: error.message,
    });
  }
};

//------------------------Chuyển từ regisPartner sang user------------------------
const switchToUser = async (req, res) => {
  // try {
  //   const { userId } = req.params; // Lấy userId từ params
  //   const updatedUser = await switchRole(userId, "regisPartner", "user");

  //   res.status(200).json({
  //     message: "User has been successfully switched to user role.",
  //     user: updatedUser,
  //   });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
  const { userIds } = req.body;
  if (!userIds || userIds.length === 0) {
    throw new Error("No user found or already");
  }

  try {
    const roleToUser = await switchRole(userIds, "regisPartner", "user");
    res.status(200).json({
      message: "Update role regispartner to user successfully",
      roleRegisToUserCount: roleToUser.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update role regis to user",
      error: error.message,
    });
  }
};

export {
  getAllUsers,
  getUsersWithPartnerRole,
  getBannedUsers,
  getAllBannedUsers,
  deleteUserAccount,
  banUserAccount,
  unbanUserAccount,
  searchUsersByKeyword,
  getUsersWithRequestPartner,
  switchToPartner,
  switchPartnerToUser,
  switchToUser,
};
