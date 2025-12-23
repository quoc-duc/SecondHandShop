import express from "express";
import crypto from "crypto";
import moment from "moment";
import qs from "qs";
import config from "config";
import dateFormat from "dateformat";

const vnPayCheckout = express.Router();

const vnp_TmnCode = config.get("vnp_TmnCode");
const vnp_HashSecret = config.get("vnp_HashSecret");
const vnp_Url = config.get("vnp_Url");
const vnp_ReturnUrl = config.get("vnp_ReturnUrl");

// Hàm sắp xếp object theo thứ tự key tăng dần
function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
  });
  return sorted;
}

vnPayCheckout.post("/create_payment_url", function (req, res, next) {
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

vnPayCheckout.get("/check-payment-vnpay", function (req, res, next) {
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

export default vnPayCheckout;
