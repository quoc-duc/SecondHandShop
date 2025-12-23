import { createCartItem, getCartItemsByUserId, updateCartItem, deleteCartItem } from '../services/cartService.js';

// Thêm một mục vào giỏ hàng
const addCartItem = async (req, res) => {
    try {
        const cartItem = await createCartItem(req.body);
        return res.status(201).send(cartItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Lấy tất cả các mục trong giỏ hàng của người dùng
const getCartItemsByUser = async (req, res) => {
    try {
        const cartItems = await getCartItemsByUserId(req.params.userId);
        return res.status(200).send(cartItems);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Cập nhật một mục trong giỏ hàng
const updateCart = async (req, res) => {
    try {
        const cartItem = await updateCartItem(req.params.id, req.body);
        if (!cartItem) {
            return res.status(404).send({ message: 'Cart item not found' });
        }
        return res.status(200).send(cartItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

// Xóa một mục trong giỏ hàng
const deleteCart = async (req, res) => {
    try {
        const cartItem = await deleteCartItem(req.params.id);
        if (!cartItem) {
            return res.status(404).send({ message: 'Cart item not found' });
        }
        return res.status(204).send();
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
};

export { addCartItem, getCartItemsByUser, updateCart, deleteCart };