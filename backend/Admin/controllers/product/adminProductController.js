import {
  updateProductApproveToTrue,
  getProducts,
  updateProductApproveToFalse,
  deleteProducts,
  getRequestProducts,
} from "../../services/product/adminProductService.js";

//-------------------Chấp nhận cho hiện bài viết sản phẩm------------------
const approveProducts = async (req, res) => {
  const { productIds } = req.body;
  if (!productIds || productIds.length === 0) {
    return res.status(400).json({ message: "No product IDs" });
  }
  try {
    const updateApproveToTrue = await updateProductApproveToTrue(productIds);
    res.status(200).json({
      message: "Products approve successfully",
      approveCount: updateApproveToTrue.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve products",
      error: error.message,
    });
  }
};

//-----------------Ẩn sản phẩm (status thành false)-------------------------
const hideProducts = async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || productIds.length === 0) {
    return res.status(400).json({ message: "No product IDs" });
  }

  try {
    const updateApproveToFalse = await updateProductApproveToFalse(productIds);
    res.status(200).json({
      message: "Products hide successfully",
      hideCount: updateApproveToFalse.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to hide products",
      error: error.messge,
    });
  }
};

//-{----------------------Xóa sản phẩm---------------------------}
const removeProducts = async (req, res) => {
  const { productIds } = req.body;

  if (!productIds || productIds.length === 0) {
    return res.status(400).json({ message: "No product IDs provided" });
  }

  try {
    const deletedProducts = await deleteProducts(productIds);
    res.status(200).json({
      message: "Products deleted successfully",
      deletedCount: deletedProducts.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete products",
      error: error.message,
    });
  }
};

//--------------------Lấy tất cả sản phẩm đã duyệt------------------------
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter;

    const result = await getProducts(page, limit, sort, filter);

    res.status(200).json({
      success: true,
      totalProducts: result.totalProducts,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      skip: result.skip,
      products: result.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//--------------------Lấy tất cả sản phẩm chưa duyệt---------------------
const getPendingProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter;
    const result = await getRequestProducts(page, limit, sort, filter);

    res.status(200).json({
      success: true,
      totalProducts: result.totalProducts,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      products: result.products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  approveProducts,
  getAllProducts,
  hideProducts,
  removeProducts,
  getPendingProducts,
};
