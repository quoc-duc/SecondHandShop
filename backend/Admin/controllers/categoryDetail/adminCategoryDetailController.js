import {
  getAllCategoryDetails,
  getCategoryDetailById,
  createCategoryDetail,
  updateCategoryDetail,
  deleteCategoryDetail,
  getCategoryDetailsByParentId,
} from "../../services/categoryDetail/adminCategoryDetailService.js";

// Lấy tất cả danh mục chi tiết
export const fetchAllCategoryDetails = async (req, res) => {
  try {
    const categoryDetails = await getAllCategoryDetails();
    res.status(200).json(categoryDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy danh mục chi tiết theo ID
export const fetchCategoryDetailById = async (req, res) => {
  try {
    const categoryDetail = await getCategoryDetailById(req.params.id);
    if (!categoryDetail) {
      return res.status(404).json({ message: "Danh mục không tìm thấy." });
    }
    res.status(200).json(categoryDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo danh mục chi tiết mới
export const postNewCategoryDetail = async (req, res) => {
  try {
    const newCategoryDetail = await createCategoryDetail(req.body);
    res.status(201).json(newCategoryDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật danh mục chi tiết
export const customCategoryDetail = async (req, res) => {
  try {
    const updatedCategoryDetail = await updateCategoryDetail(
      req.params.id,
      req.body
    );
    if (!updatedCategoryDetail) {
      return res.status(404).json({ message: "Danh mục không tìm thấy." });
    }
    res.status(200).json(updatedCategoryDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa danh mục chi tiết
export const removeCategoryDetail = async (req, res) => {
  try {
    const deletedCategoryDetail = await deleteCategoryDetail(req.params.id);
    if (!deletedCategoryDetail) {
      return res.status(404).json({ message: "Danh mục không tìm thấy." });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const fetchCategoryDetailsByParentId = async (req, res) => {
  try {
    const categoryDetails = await getCategoryDetailsByParentId(req.params.id);
    if (categoryDetails.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có danh mục chi tiết nào." });
    }
    res.status(200).json(categoryDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
