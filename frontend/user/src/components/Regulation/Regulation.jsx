import React, { useEffect, useState } from "react";
import { getAllRegulation } from "../../hooks/Regulation";
import { message } from 'antd';

const Regulation = () => {
    const [regulations, setRegulations] = useState([]);

    useEffect(() => {
        const fetchRegulations = async () => {
            try {
                const regulations = await getAllRegulation();
                setRegulations(regulations);
            } catch (error) {
                console.error("Error fetching regulations:", error);
                message.error("Lỗi khi tải quy định");
            }
        };

        fetchRegulations();
    }, []); // Chạy một lần khi component mount

    const handleButtonClick = () => {
        message.success('Thông báo thành công!');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md h-screen overflow-y-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Quy định chung</h1>
            <button onClick={handleButtonClick} className="mb-4">
                Hiển thị thông báo
            </button>
            <div className="space-y-4">
                {regulations.map((regulation) => (
                    <div key={regulation._id} className="bg-white border border-gray-300 rounded-lg p-4 transition-shadow hover:shadow-lg">
                        <h2 className="text-xl font-semibold text-blue-600">{regulation.title}</h2>
                        <p className="text-gray-700">{regulation.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Regulation;