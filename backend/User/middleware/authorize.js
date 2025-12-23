// import jwt from "jsonwebtoken";

// // Middleware xác thực
// const authorize = () => {
//   return (req, res, next) => {
//     // Lấy token từ header Authorization
//     const authHeader = req.headers["authorization"];

//     if (!authHeader) {
//       return res.status(403).send("Access denied. No token provided.");
//     }

//     // Tách token từ header
//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(403).send("Access denied. No token provided.");
//     }

//     try {
//       // Giải mã token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET); // Sử dụng biến môi trường cho bí mật

//       req.user = decoded; // Lưu thông tin người dùng vào req.user

//       next(); // Tiếp tục nếu tất cả các điều kiện đều thỏa mãn
//     } catch (error) {
//       return res.status(400).send("Invalid token.");
//     }
//   };
// };

// export default authorize;

import jwt from "jsonwebtoken";

import CustomError from "../models/CustomError.js";

// export const authorize = (req, res, next) => {
//   const token = req.header("authorization");

//   if (!token)
//     return next(new CustomError("No token, authorization denied.", 401));

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     return next(new CustomError("Token is not valid.", 401));
//   }
// };

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

export const authorize = (req, res, next) => {
  const authHeader = req.header("authorization");

  if (!authHeader)
    return next(new CustomError("No token, authorization denied.", 401));

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // hoặc decoded.user nếu bạn gói trong `{ user: {...} }`
    next();
  } catch (err) {
    return next(new CustomError("Token is not valid.", 401));
  }
};

export const authorizeOptional = (req, res, next) => {
  const authHeader = req.header("authorization");
  if (!authHeader) return next(); // Không có token thì bỏ qua

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Token không hợp lệ thì tiếp tục mà không có req.user
  }

  next();
};
