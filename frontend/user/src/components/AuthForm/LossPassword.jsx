import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/auth'; // Đảm bảo đường dẫn đúng tới hook useAuth
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateProfile } from '../../hooks/Users';
import { IP } from '../../config';

const ReGetPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP
    const [error, setError] = useState('');
    const { sendOtp, verifyOtp } = useAuth(); // Sử dụng hook để gửi và xác thực OTP
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null); // Lưu ID người dùng
    const [ival, setival] = useState(false);

    // Hàm kiểm tra người dùng
    const checkUser = async () => {
        try {
            const response = await axios.post(`http://${IP}:5555/users/email`, { email });
            if (response.data._id) {
                setUserId(response.data._id); // Lưu ID người dùng
            } else {
                alert("Không tồn tại người dùng!");
            }
        } catch (error) {
            console.error("Error checking user:", error);
            alert("Đã xảy ra lỗi khi kiểm tra người dùng.");
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra người dùng trước khi gửi OTP
        await checkUser();

        if (userId) {
            const success = await sendOtp(email);
            if (success) {
                setStep(2); // Chuyển sang bước nhập OTP
            } else {
                setError('Failed to send OTP. Please try again.');
            }
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const isValid = await verifyOtp(email, otp);
        
        if (isValid) {
            setival(true)
            const updatedUserInfo = { password: otp }; // Xem xét mã hóa mật khẩu ở đây
            await updateProfile(userId, updatedUserInfo);
            setOtp('');
            alert(`Xác thực thành công!`);
            // Chuyển hướng tới trang đăng nhập hoặc một trang khác
            navigate('/login'); // Hoặc trang bạn muốn chuyển hướng
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="p-5 bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">
                    {step === 1 ? 'Lấy lại mật khẩu' : 'Nhập mã OTP'}
                </h2>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit}>
                        <input
                            type="email"
                            placeholder="Nhập địa chỉ email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="border w-full p-2 mb-4"
                        />
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                            Gửi mã OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleOtpSubmit}>
                        <input
                            type="text"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="border w-full p-2 mb-4"
                        />
                        {ival ? <p className='text-red-500 p-2'> Mật khẩu mới của bạn là: {otp}</p> : null}
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                            Xác thực OTP
                        </button>
                        
                    </form>
                )}
                <button onClick={() => navigate('/login')} className="w-full mt-6 bg-gray-100 text-green-600 hover:underline p-2 rounded">
                    Trở về trang đăng nhập
                </button>
            </div>
        </div>
    );
};

export default ReGetPassword;