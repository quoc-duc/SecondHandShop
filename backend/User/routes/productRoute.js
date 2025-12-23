import express from "express";
import {
  addProduct,
  getAllProducts,
  getAllVideoProducts,
  getAllProducts1,
  getProductById,
  getProductsByIdCategory,
  getProductsByUserIdController,
  getProductsByUserIdSoldOutController,
  getProductsByUserIdNotApproveController,
  searchProductsByNameController,
  searchProductsController,
  updateProduct,
  updateQuanlity,
  deleteProduct,
} from "../controllers/productController.js";

import { authorizeOptional } from "../middleware/authorize.js";

const productRoute = express.Router();

productRoute.post("/", addProduct);
productRoute.get("/", getAllProducts);
productRoute.get("/video", getAllVideoProducts);
productRoute.get("/page/", getAllProducts1);
productRoute.get("/search", searchProductsByNameController);
productRoute.get("/product/search", searchProductsController);
productRoute.get("/:id", authorizeOptional, getProductById);
productRoute.get("/category/:categoryId", getProductsByIdCategory);
productRoute.get("/user/:userId", getProductsByUserIdController);
productRoute.get("/notapprove/user/:userId", getProductsByUserIdNotApproveController);
productRoute.get("/soldout/user/:userId", getProductsByUserIdSoldOutController);
productRoute.put("/quanlity", updateQuanlity);
productRoute.put("/:id", updateProduct);
productRoute.delete("/:id", deleteProduct);

export default productRoute;
