import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IP } from "../../config";
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import icon

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false); // Trạng thái hiển thị mật khẩu cũ
    const [showNewPassword, setShowNewPassword] = useState(false); // Trạng thái hiển thị mật khẩu mới
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Trạng thái hiển thị xác nhận mật khẩu
    const navigate = useNavigate();

    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            setNewPassword('');
            setConfirmPassword('');
            return;
        }

        try {
            const response = await axios.post(`http://${IP}:5555/users/comparePassword`, {
                id: userInfo._id,
                password: oldPassword
            });

            if (response.data.valid) {
                await axios.put(`http://${IP}:5555/users/${userInfo._id}`, {
                    password: newPassword
                });
                setSuccess("Mật khẩu đã được cập nhật thành công!");
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError("Mật khẩu cũ không đúng.");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi. Vui lòng thử lại.");
        }
    };

    return (
        <div className="p-5 bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
                <h2 className="text-lg font-semibold mb-4">Đổi mật khẩu</h2>
                {error && <div className="text-red-500 mb-2">{error}</div>}
                {success && <div className="text-green-500 mb-2">{success}</div>}
                <form onSubmit={handleChangePassword}>
                    <div className="relative mb-4">
                        <input
                            type={showOldPassword ? "text" : "password"}
                            placeholder="Mật khẩu cũ"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="border w-full p-2"
                        />
                        <span 
                            className="absolute right-2 top-2 cursor-pointer" 
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>
                    <div className="relative mb-4">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="border w-full p-2"
                        />
                        <span 
                            className="absolute right-2 top-2 cursor-pointer" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>
                    <div className="relative mb-4">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="border w-full p-2"
                        />
                        <span 
                            className="absolute right-2 top-2 cursor-pointer" 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                        Đổi mật khẩu
                    </button>
                </form>
                <button onClick={() => navigate('/')} className="w-full mt-6 bg-gray-100 text-green-600 hover:underline p-2 rounded">
                    Trở về trang chính
                </button>
            </div>
        </div>
    );
};

export default ChangePassword;