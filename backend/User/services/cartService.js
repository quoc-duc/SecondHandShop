import Carts from '../models/Carts.js';

const getCartItemsByUserId = async (userId) => {
    return await Carts.find({ user_buyer: userId });
};

// Thêm một mục mới vào giỏ hàng
const createCartItem = async (cartData) => {
    const cartItem = new Carts(cartData);
    return await cartItem.save();
};

// Cập nhật một mục trong giỏ hàng
const updateCartItem = async (cartItemId, updateData) => {
    return await Carts.findByIdAndUpdate(
        cartItemId,
        updateData,
        { new: true } // Trả về bản ghi mới sau khi cập nhật
    );
};

// Xóa một mục trong giỏ hàng
const deleteCartItem = async (cartItemId) => {
    return await Carts.findByIdAndDelete(cartItemId);
};

export { createCartItem, getCartItemsByUserId, updateCartItem, deleteCartItem };