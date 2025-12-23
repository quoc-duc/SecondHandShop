import Products from "../models/Products.js";

const createProduct = async (productData) => {
  const product = new Products(productData);
  return await product.save();
};

const getProducts = async () => {
  return await Products.find({
    status: true,
    approve: true,
    quantity: { $gt: 0 },
  });
};

const getVideoProducts = async () => {
  return await Products.find({
    status: true,
    approve: true,
    quantity: { $gt: 0 },
    $or: [
      { image_url: { $exists: false } }, // image_url không tồn tại
      { image_url: "" },                 // image_url là chuỗi rỗng
    ],
    video_url: { $exists: true, $ne: "" }, // video_url tồn tại và không phải chuỗi rỗng
  });
};

const getProducts1 = async (page, limit) => {
    const skip = (page - 1) * limit;
    const products = await Products.find({status: true, approve: true, quantity: { $gt: 0 },}).skip(skip).limit(limit);
    const total = await Products.countDocuments({status: true, approve: true, quantity: { $gt: 0 },});
  
    return {
      products,
        totalPages: Math.ceil(total / limit),
    };
};

const getOneProductById = async (idProduct) => {
  return await Products.findOne({ _id: idProduct });
};

const getProductsByCategory = async (categoryId) => {
  try {
    const products = await Products.find({
      category_id: categoryId,
      status: true,
      approve: true,
      quantity: { $gt: 0 },
    });
    return products;
  } catch (error) {
    throw new Error(`Unable to fetch products: ${error.message}`);
  }
};

const getProductsByUserId = async (userId) => {
  try {
    const products = await Products.find({
      user_id: userId,
      status: true,
      approve: true,
      quantity: { $gt: 0 },
    });
    return products;
  } catch (error) {
    throw new Error(`Unable to fetch products: ${error.message}`);
  }
};

const getProductsByUserIdSoldOut = async (userId) => {
  try {
    const products = await Products.find({
      user_id: userId,
      status: true,
      approve: true,
      quantity: { $eq: 0 },
    });
    return products;
  } catch (error) {
    throw new Error(`Unable to fetch products: ${error.message}`);
  }
};

const getProductsByUserIdNotApprove = async (userId) => {
  try {
    const products = await Products.find({
      user_id: userId,
      status: true,
      approve: false,
      quantity: { $gt: 0 },
    });
    return products;
  } catch (error) {
    throw new Error(`Unable to fetch products: ${error.message}`);
  }
};

// Tìm kiếm sản phẩm theo tên
const searchProductsByName = async (productName) => {
  try {
    // Tìm kiếm sản phẩm với tên không phân biệt chữ hoa chữ thường
    return await Products.find({
      name: { $regex: productName, $options: "i" }, // 'i' để không phân biệt chữ hoa chữ thường
      status: true,
      approve: true, // Chỉ tìm kiếm sản phẩm còn hoạt động
      quantity: { $gt: 0 },
    });
  } catch (error) {
    throw new Error(`Unable to search products: ${error.message}`);
  }
};

const searchProducts = async ({
  name,
  brand,
  minPrice,
  maxPrice,
  origin,
  condition,
}) => {
  const query = { status: true, approve: true, quantity: { $gt: 0 } };

  if (name) query.name = { $regex: name, $options: "i" };
  if (brand) query.brand = { $regex: brand, $options: "i" };
  if (origin) query.origin = { $regex: origin, $options: "i" };
  if (condition) query.condition = condition;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  return await Products.find(query);
};

const updateOneProduct = async (id, updateData) => {
  return await Products.findByIdAndUpdate(id, updateData, { new: true });
};

const updateQuanlityProduct = async (id, quanlity) => {
  return await Products.findByIdAndUpdate(
    id,
    { $inc: { quantity: quanlity } },
    { new: true }
  );
};

const deleteOneProduct = async (id) => {
  return await Products.findByIdAndUpdate(id, { status: false }, { new: true });
};

export {
  createProduct,
  getProducts,
  getVideoProducts,
  getProducts1,
  getOneProductById,
  getProductsByCategory,
  getProductsByUserId,
  getProductsByUserIdSoldOut,
  searchProductsByName,
  searchProducts,
  updateOneProduct,
  updateQuanlityProduct,
  getProductsByUserIdNotApprove,
  deleteOneProduct,
};
