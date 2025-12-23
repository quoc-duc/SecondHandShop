import express from "express";
import { loginUser } from "../controllers/authController.js";
import { validateLoginUser } from "../middleware/checkAuth.js";

const authRoute = express.Router();

authRoute.post("/login", validateLoginUser, loginUser);

export default authRoute;
