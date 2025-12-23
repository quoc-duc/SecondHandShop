import express from 'express';
import {
    addCartItem,
    getCartItemsByUser,
    updateCart,
    deleteCart
} from '../controllers/cartController.js';

const cartRoute = express.Router();

// Thêm một mục vào giỏ hàng
cartRoute.post('/', addCartItem);

// Lấy tất cả các mục trong giỏ hàng của người dùng
cartRoute.get('/:userId', getCartItemsByUser);

// Cập nhật một mục trong giỏ hàng
cartRoute.put('/:id', updateCart);

// Xóa một mục trong giỏ hàng
cartRoute.delete('/:id', deleteCart);

export default cartRoute;