import Categories from '../models/Categories.js';

const createCategory = async (CategoryData) => {
    const Category = new Categories(CategoryData);
    return await Category.save();
  };
  
const getCategory = async () => {
  return Categories.find({ status: true });
  // const limit = 'full';
  // const skip = 0;
  // const total = await Categories.countDocuments({ status: true });
  // const categories = limit === 'full'? 
  //           await Categories.find({ status: true }).skip(skip): 
  //           await Categories.find({ status: true }).limit(limit).skip(skip);

  //       // Tạo và trả về đối tượng JSON
  //       return {
  //           success: true,
  //           total,
  //           limit,
  //           skip,
  //           data: categories,
  //       };
};
  
const getOneCategoryById = async (idCategory) => {
    return await Categories.findById(idCategory);
  };
  
const updateOneCategory = async (id, updateData) => {
    return await Categories.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
  };
  
const deleteOneCategory = async (id) => {
    return await Categories.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );
};

export {createCategory, getCategory, getOneCategoryById, updateOneCategory, deleteOneCategory}