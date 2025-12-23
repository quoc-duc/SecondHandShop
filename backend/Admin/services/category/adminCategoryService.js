import Categories from "../../../User/models/Categories.js";
import Products from "../../../User/models/Products.js";

// Lấy tất cả categories có phân trang và tổng số
export const getAllCategories = async (page = 1, limit = 10, sort, filter) => {
  try {
    const query = { status: true };
    const skip = (page - 1) * limit;
    if (filter) {
      const label = filter[0];
      const value = filter[1];
      query[label] = { $regex: value, $options: "i" };
      const filterCategories = await Categories.find(query)
        .skip(skip)
        .limit(limit)
        .lean();
      const totalCategories = await Categories.countDocuments(query);
      const totalPages = await Math.ceil(totalCategories / limit);
      return {
        categories: filterCategories,
        totalCategories,
        totalPages,
        limit,
        skip,
        currentPage: page,
      };
    }
    const totalCategories = await Categories.countDocuments(query);
    const totalPages = await Math.ceil(totalCategories / limit);

    if (sort) {
      const objectSort = {};
      objectSort[sort[1]] = sort[0];
      const sortCategories = await Categories.find(query)
        .skip(skip)
        .limit(limit)
        .sort(objectSort)
        .lean();
      return {
        categories: sortCategories,
        totalCategories,
        totalPages,
        limit,
        skip,
        currentPage: page,
      };
    }

    const categories = await Categories.find(query)
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      categories,
      totalCategories,
      totalPages,
      limit,
      skip,
      currentPage: page,
    };
  } catch (error) {
    throw new Error("Error fetching categories: " + error.message);
  }
};

// Thêm mới category
export const addCategory = async (data) => {
  try {
    const category = new Categories(data);
    return await category.save();
  } catch (error) {
    throw new Error("Error adding category: " + error.message);
  }
};

// Sửa category theo ID
export const updateCategory = async (id, data) => {
  try {
    return await Categories.findByIdAndUpdate(id, data, { new: true });
  } catch (error) {
    throw new Error("Error updating category: " + error.message);
  }
};

// Xóa category theo ID
export const deleteCategory = async (categoryIds) => {
  try {
    const categories = await Categories.updateMany(
      { _id: { $in: categoryIds } },
      { status: false }
    );
    if (categories.modifiedCount === 0) {
      throw new Error("No category found or already");
    }
    return categories;
  } catch (error) {
    throw new Error("Error deleting category: " + error.message);
  }
};
