// backend/controllers/productController.js
import jwt from "jsonwebtoken";
import ProductViews from "../models/ProductView.js";

import {
  createProduct,
  getProducts,
  getVideoProducts,
  getProducts1,
  getOneProductById,
  getProductsByUserIdSoldOut,
  getProductsByCategory,
  getProductsByUserId,
  getProductsByUserIdNotApprove,
  searchProductsByName,
  searchProducts,
  updateOneProduct,
  updateQuanlityProduct,
  deleteOneProduct,
} from "../services/productService.js"; // Đảm bảo đường dẫn đúng

// Thêm sản phẩm
const addProduct = async (req, res) => {
  try {
    const product = await createProduct(req.body);
    return res.status(201).send(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await getProducts();
    return res.status(200).send(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getAllVideoProducts = async (req, res) => {
  try {
    const products = await getVideoProducts();
    return res.status(200).send(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getAllProducts1 = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const { products, totalPages } = await getProducts1(page, limit);
        res.status(200).json({
            data: products,
            totalPages,
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
  try {
    const product = await getOneProductById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Lưu lượt xem nếu người dùng đã đăng nhập
    if (req.user && req.user.id) {
      const { id: user_id } = req.user;
      const product_id = req.params.id;

      await ProductViews.findOneAndUpdate(
        { user_id, product_id },
        {
          view_product: true,
        },
        { upsert: true, new: true }
      );
    }

    return res.status(200).send(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getProductsByIdCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const product = await getProductsByCategory(categoryId);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    const products = await getProductsByCategory(categoryId);
    return res.status(200).send(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getProductsByUserIdController = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  try {
    const products = await getProductsByUserId(userId);
    if (!products || products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found for this user" });
    }
    return res.status(200).send(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getProductsByUserIdSoldOutController = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  try {
    const products = await getProductsByUserIdSoldOut(userId);
    if (!products || products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found for this user" });
    }
    return res.status(200).send(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getProductsByUserIdNotApproveController = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params
  try {
    const products = await getProductsByUserIdNotApprove(userId);
    if (!products || products.length === 0) {
      return res
        .status(404)
        .send({ message: "No products found for this user" });
    }
    return res.status(200).send(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const searchProductsByNameController = async (req, res) => {
  try {
    const name = req.query.name; // Lấy tên sản phẩm từ query parameters
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Product name is required." });
    }

    const products = await searchProductsByName(name);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchProductsController = async (req, res) => {
  try {
    const { name, brand, minPrice, maxPrice, origin, condition } = req.query;
    const products = await searchProducts({
      name,
      brand,
      minPrice,
      maxPrice,
      origin,
      condition,
    });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const product = await updateOneProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    return res.status(200).send(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

const updateQuanlity = async (req, res) => {
  try {
    const product = await updateQuanlityProduct(req.body.id, req.body.quanlity);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    return res.status(200).send(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const product = await deleteOneProduct(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    return res.status(204).send({ message: "Xoá thành công" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
};

export {
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
};
