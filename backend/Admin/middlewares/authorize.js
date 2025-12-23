import jwt from "jsonwebtoken";
import CustomError from "../../User/models/CustomError.js";

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
