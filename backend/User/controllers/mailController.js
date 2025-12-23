// controllers/authController.js
import { randomInt } from 'crypto';
import sendOtpEmail from '../services/mailService.js'; // Nhập dịch vụ gửi email

let otps = {}; // Lưu trữ mã OTP tạm thời

// Hàm gửi mã OTP
const sendOtp = async (req, res) => {
    const { email } = req.body;
    const otp = randomInt(100000, 999999); // Tạo mã OTP ngẫu nhiên

    try {
        await sendOtpEmail(email, otp); // Gửi mã OTP qua email
        otps[email] = otp; // Lưu mã OTP vào bộ nhớ tạm
        return res.status(200).json({ message: 'Mã OTP đã được gửi.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Hàm xác thực mã OTP
const verifyOtp = (req, res) => {
    const { email, otp } = req.body;
    if (otps[email] == otp) {
        delete otps[email]; // Xóa mã OTP sau khi xác thực thành công
        return res.status(200).json({ valid: true });
    }

    return res.status(400).json({ valid: false });
};

export {
    sendOtp,
    verifyOtp,
};