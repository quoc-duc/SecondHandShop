// routes/authRoutes.js
import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/mailController.js'; // Nhập controller

const mailRoute = Router();

// Route gửi mã OTP
mailRoute.post('/send-otp', sendOtp);

// Route xác thực mã OTP
mailRoute.post('/verify-otp', verifyOtp);

export default mailRoute;