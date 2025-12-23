import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/category/adminCategoryService.js";

// Lấy tất cả categories có phân trang và tổng số
export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sort = req.query.sort;
    const filter = req.query.filter;

    const result = await getAllCategories(page, limit, sort, filter);
    res.status(200).json({
      success: true,
      totalCategories: result.totalCategories,
      totalPages: result.totalPages,
      limit: result.limit,
      skip: result.skip,
      currentPage: result.currentPages,
      categories: result.categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Thêm mới category
export const createCategory = async (req, res) => {
  try {
    const newCategory = await addCategory(req.body);
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật category theo ID
export const editCategory = async (req, res) => {
  try {
    const updatedCategory = await updateCategory(req.params.id, req.body);
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa category theo ID
export const removeCategory = async (req, res) => {
  const { categoryIds } = req.body;
  try {
    const deletedCategory = await deleteCategory(categoryIds);
    res.status(200).json({
      message: "Category deleted successfully",
      deleteCount: deletedCategory.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
