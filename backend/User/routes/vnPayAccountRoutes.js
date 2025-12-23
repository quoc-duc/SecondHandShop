import express from 'express';
import { register, login, transferMoney, getAccountDetails } from '../controllers/vnPayAccountController.js';
import { verifyToken } from '../middleware/authorize.js';

const VNPayAccountRouter = express.Router();

VNPayAccountRouter.post('/register', register);
VNPayAccountRouter.post('/login', login); // Implement login route
VNPayAccountRouter.post('/transfer', transferMoney);
VNPayAccountRouter.get('/account', verifyToken, getAccountDetails);

export default VNPayAccountRouter;