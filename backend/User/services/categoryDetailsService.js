import CategoryDetails from '../models/CategoryDetails.js';

// Lấy tất cả danh mục chi tiết
export const getAllCategoryDetails = async () => {
    return await CategoryDetails.find();
};

// Lấy danh mục chi tiết theo ID
export const getCategoryDetailById = async (id) => {
    return await CategoryDetails.findById(id);
};

// Tạo danh mục chi tiết mới
export const createCategoryDetail = async (data) => {
    const newCategoryDetail = new CategoryDetails(data);
    return await newCategoryDetail.save();
};

// Cập nhật danh mục chi tiết
export const updateCategoryDetail = async (id, data) => {
    return await CategoryDetails.findByIdAndUpdate(id, data, { new: true });
};

// Xóa danh mục chi tiết
export const deleteCategoryDetail = async (id) => {
    return await CategoryDetails.findByIdAndDelete(id);
};

// Lấy danh mục chi tiết theo ID danh mục cha
export const getCategoryDetailsByParentId = async (categoryId) => {
    return await CategoryDetails.find({ category_id: categoryId });
};