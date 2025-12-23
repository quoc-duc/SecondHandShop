// routes.js
import express from "express";
import {
  loginAdmin,
  logoutAdmin,
} from "../controllers/auth/adminAuthController.js";
import {
  getAllUsers,
  getUsersWithPartnerRole,
  getAllBannedUsers,
  deleteUserAccount,
  banUserAccount,
  unbanUserAccount,
  searchUsersByKeyword,
  getUsersWithRequestPartner,
  switchPartnerToUser,
  switchToPartner,
  switchToUser,
} from "../controllers/user/adminUserController.js";

import {
  approveProducts,
  getAllProducts,
  hideProducts,
  removeProducts,
  getPendingProducts,
} from "../controllers/product/adminProductController.js";

import {
  getFeedbacks,
  sendFeedbackReply,
} from "../controllers/feedback/adminFeedbackController.js";

import {
  getCategories,
  createCategory,
  editCategory,
  removeCategory,
} from "../controllers/category/adminCategoryController.js";

import {
  fetchAllCategoryDetails,
  fetchCategoryDetailById,
  postNewCategoryDetail,
  customCategoryDetail,
  removeCategoryDetail,
  fetchCategoryDetailsByParentId,
} from "../controllers/categoryDetail/adminCategoryDetailController.js";

import {
  fetchAllNotifications,
  postNotification,
  removeNotification,
} from "../controllers/notification/adminNotificationController.js";

import {
  getRegulations,
  addRegulation,
  editRegulation,
  removeRegulation,
} from "../controllers/regulation/adminRegulationController.js";

import {
  getUserStatistics,
  getOrderStatisticsByYear,
  getOrderStatusChart,
  getRatingPieChart,
  getTopUserPostProduct,
  getTopBuyer,
} from "../controllers/chart/adminChartController.js";

import {
  fetchTopSellingProducts,
  fetchOrderStats,
  fetchAllOrders,
  updateOrderController,
} from "../controllers/order/adminOrderController.js";
import { authorize } from "../middlewares/authorize.js";
import { validateLoginUser } from "../middlewares/checkAuth.js";

import {
  fetchAllReviews,
  removeReview,
} from "../controllers/reviews/adminReviewController.js";

import crypto from "crypto";
import moment from "moment";
import qs from "qs";
import config from "config";
import dateFormat from "dateformat";

const vnPayCheckout = express.Router();

const vnp_TmnCode = config.get("vnp_TmnCode");
const vnp_HashSecret = config.get("vnp_HashSecret");
const vnp_Url = config.get("vnp_Url");
const vnp_ReturnUrl = config.get("vnp_AdminReturnUrl");

const adminRouter = express.Router();

// Hàm sắp xếp object theo thứ tự key tăng dần
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
}

adminRouter.post("/login", validateLoginUser, loginAdmin);
adminRouter.post("/logout", logoutAdmin);

adminRouter.get("/all-users", authorize, getAllUsers);
adminRouter.get("/all-partners", authorize, getUsersWithPartnerRole);
adminRouter.get("/all-requestpartners", authorize, getUsersWithRequestPartner);
adminRouter.get("/all-banner", authorize, getAllBannedUsers);
adminRouter.put("/ban-user", authorize, banUserAccount);
adminRouter.put("/unban-user", authorize, unbanUserAccount);
adminRouter.delete("/delete-account", authorize, deleteUserAccount);
adminRouter.get("/search", authorize, searchUsersByKeyword);
adminRouter.put("/approve-partner", authorize, switchToPartner);
adminRouter.put("/delete-role-partner", authorize, switchPartnerToUser);
adminRouter.put("/switch-to-user", authorize, switchToUser);

adminRouter.put("/approve-products", authorize, approveProducts);
adminRouter.get("/products", authorize, getAllProducts);
adminRouter.put("/hide-products", authorize, hideProducts);
adminRouter.get("/pending-products", authorize, getPendingProducts);
adminRouter.delete("/delete-products", authorize, removeProducts);

adminRouter.get("/all-feedback", authorize, getFeedbacks);
adminRouter.post("/reply", authorize, sendFeedbackReply);

adminRouter.get("/categories", authorize, getCategories);
adminRouter.post("/category/", authorize, createCategory);
adminRouter.put("/category/:id", authorize, editCategory);
adminRouter.delete("/category", authorize, removeCategory);

adminRouter.get("/all-sub-categories", fetchAllCategoryDetails);
adminRouter.get("/sub-category/:id", fetchCategoryDetailById);
adminRouter.post("/sub-category/", postNewCategoryDetail);
adminRouter.put("/sub-category/:id", customCategoryDetail);
adminRouter.delete("/sub-category/:id", removeCategoryDetail);
adminRouter.get("/sub-category-by-parent/:id", fetchCategoryDetailsByParentId);

adminRouter.get("/notifications/", authorize, fetchAllNotifications);
adminRouter.post("/notifications/", authorize, postNotification);
adminRouter.delete("/notifications", authorize, removeNotification);

adminRouter.get("/regulations/", authorize, getRegulations);
adminRouter.post("/regulation/", authorize, addRegulation);
adminRouter.put("/regulation/:id", authorize, editRegulation);
adminRouter.delete("/regulation", authorize, removeRegulation);

adminRouter.get("/statistics/yearly-users", authorize, getUserStatistics);
adminRouter.get(
  "/statistics-order-product",
  authorize,
  getOrderStatisticsByYear
);
adminRouter.get("/orders/status-chart", authorize, getOrderStatusChart);
adminRouter.get("/rating-distribution", authorize, getRatingPieChart);
adminRouter.get("/top-user-order", authorize, getTopBuyer);
adminRouter.get("/top-user-product-post", authorize, getTopUserPostProduct);

adminRouter.get("/top-selling-products", authorize, fetchTopSellingProducts);
adminRouter.get("/order-stats", authorize, fetchOrderStats);
adminRouter.get("/orders", authorize, fetchAllOrders);
adminRouter.put("/order/:id", authorize, updateOrderController);

adminRouter.get("/reviews", authorize, fetchAllReviews);
adminRouter.delete("/reviews", authorize, removeReview);

adminRouter.post("/create_payment_url", function (req, res, next) {
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  const date = new Date();
  const createDate = dateFormat(date, "yyyymmddHHMMss");
  const orderId = dateFormat(date, "HHMMss");
  const expireDate = dateFormat(
    new Date(date.getTime() + 15 * 60000),
    "yyyymmddHHMMss"
  );

  const amount = req.body.amount;
  const bankCode = req.body.bankCode;
  const orderInfo = req.body.orderDescription;
  const orderType = req.body.orderType;
  let locale = req.body.language || "vn";

  const currCode = "VND";

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: vnp_TmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: (amount * 100).toFixed(0),
    vnp_ReturnUrl: vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // Sắp xếp và tạo chuỗi ký
  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;

  const finalUrl = vnp_Url + "?" + qs.stringify(vnp_Params, { encode: false });

  // ✅ Trả về URL như JSON thay vì redirect
  return res.status(201).json({ paymentUrl: finalUrl });
});

adminRouter.get("/check-payment-vnpay", function (req, res, next) {
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", vnp_HashSecret);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    // Kiểm tra chữ ký hợp lệ
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      // Thanh toán thành công
      res.status(200).json({
        code: vnp_Params["vnp_ResponseCode"],
        message: "Thanh toán thành công",
        data: vnp_Params,
      });
    } else {
      // Thanh toán thất bại
      res.status(200).json({
        code: vnp_Params["vnp_ResponseCode"],
        message: "Thanh toán thất bại",
        data: vnp_Params,
      });
    }
  } else {
    res.status(400).json({
      code: "97",
      message: "Chữ ký không hợp lệ",
    });
  }
});

export default adminRouter;
