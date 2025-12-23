import express from 'express';
import {
    createOrderDetailController,
    getAllOrderDetailsController,
    getOrderDetailsByOrderIdController,
    getOrderDetailsByProductIdController,
    updateOrderDetailController,
    deleteOrderDetailController
} from '../controllers/orderDetailController.js';

const orderDetailRoute = express.Router();

orderDetailRoute.post('/', createOrderDetailController);
orderDetailRoute.get('/', getAllOrderDetailsController);
orderDetailRoute.get('/order/:orderId', getOrderDetailsByOrderIdController);
orderDetailRoute.get('/product/:productId', getOrderDetailsByProductIdController);
orderDetailRoute.put('/:id', updateOrderDetailController);
orderDetailRoute.delete('/:id', deleteOrderDetailController);

export default orderDetailRoute;