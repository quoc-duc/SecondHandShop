import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Import icon từ react-icons

const BackButton = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Điều hướng về trang trước đó
    };

    return (
        <button
            onClick={handleBack}
            className="bg-yellow-300 text-white rounded p-2 hover:bg-red-600 transition flex items-center"
        >
            <FaArrowLeft className="mr-2" /> {/* Hiển thị icon với khoảng cách bên phải */}
        </button>
    );
};

export default BackButton;