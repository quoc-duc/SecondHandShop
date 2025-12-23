import express from "express";
import {
  addUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  comparePassword,
} from "../controllers/userController.js";
import { authorize } from "../middleware/authorize.js";
import { validateCreateUser } from "../middleware/checkAuth.js";

const userRoute = express.Router();

userRoute.post("/", addUser);
userRoute.post("/email", getUserByEmail);

userRoute.get("/", getUsers);
userRoute.get("/:id", getUserById);
// userRoute.get("/:id", authorize, getUserById);
userRoute.post("/comparePassword", comparePassword);

userRoute.put("/:id", updateUserById);
userRoute.delete("/:id", deleteUserById);

export default userRoute;
