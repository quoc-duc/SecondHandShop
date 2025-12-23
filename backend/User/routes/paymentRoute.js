import express from "express";
import {
  createPaymentController,
  getPaymentsByOrderIdController,
  getPaymentsByUserIdPayController,
  getPaymentsByUserIdReceiveController,
} from "../controllers/paymentController.js";

const paymentRoute = express.Router();

paymentRoute.post("/", createPaymentController);
paymentRoute.get("/order/:orderId", getPaymentsByOrderIdController);
paymentRoute.get("/pay/:userId", getPaymentsByUserIdPayController);
paymentRoute.get("/receive/:userId", getPaymentsByUserIdReceiveController);

export default paymentRoute;
