import express from "express";
import axios from "axios";
import {
  createOrderController,
  getAllOrdersController,
  getOrderByIdController,
  getOrdersByUserIdBuyerController,
  getOrdersByUserIdBuyerController1,
  getOrdersByUserIdSellerController,
  getOrdersByUserIdSellerController1,
  getOrdersByPhoneController,
  getOrdersByStatusOrderController,
  updateOrderController,
  deleteOrderController,
} from "../controllers/orderController.js";

const orderRoute = express.Router();

orderRoute.post("/", createOrderController);
orderRoute.get("/", getAllOrdersController);
orderRoute.get("/:id", getOrderByIdController);
orderRoute.get("/buyer/:userId", getOrdersByUserIdBuyerController);
orderRoute.get("/buyer1/page/", getOrdersByUserIdBuyerController1);
orderRoute.get("/seller/:userId", getOrdersByUserIdSellerController);
orderRoute.get("/seller1/page/", getOrdersByUserIdSellerController1);
orderRoute.get("/phone/:phone", getOrdersByPhoneController);
orderRoute.get("/status/:status", getOrdersByStatusOrderController);
orderRoute.put("/:id", updateOrderController);
orderRoute.delete("/:id", deleteOrderController);

orderRoute.post("/getShippingPrices", async (req, res) => {
  try {
    const {
      SENDER_PROVINCE,
      SENDER_DISTRICT,
      RECEIVER_PROVINCE,
      RECEIVER_DISTRICT,
      PRODUCT_WEIGHT,
      PRODUCT_PRICE,
      MONEY_COLLECTION,
      TYPE,
    } = req.body;

    // Add your ViettelPost API credentials here
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const payload = {
      SENDER_PROVINCE: SENDER_PROVINCE,
      SENDER_DISTRICT: SENDER_DISTRICT,
      RECEIVER_PROVINCE: RECEIVER_PROVINCE,
      RECEIVER_DISTRICT: RECEIVER_DISTRICT,
      PRODUCT_TYPE: "HH",
      PRODUCT_WEIGHT: PRODUCT_WEIGHT,
      PRODUCT_PRICE: PRODUCT_PRICE,
      MONEY_COLLECTION: MONEY_COLLECTION || PRODUCT_PRICE.toString(),
      TYPE: TYPE || 1,
    };

    const response = await axios.post(
      "https://partner.viettelpost.vn/v2/order/getPriceAll",
      payload,
      config
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching shipping prices:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: "Failed to fetch shipping prices",
      details: error.response?.data || error.message,
    });
  }
});

export default orderRoute;
