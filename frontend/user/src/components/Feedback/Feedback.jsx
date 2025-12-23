import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFeedback } from '../../hooks/Feedback';
import { FiSend } from 'react-icons/fi';

const Feedback = () => {
  const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user = "";
    if (userInfo) {
      user = userInfo._id;
    }
    const finalTopic = topic === "Khác" ? customTopic : topic;

    await createFeedback({
      user_id: user,
      email: email,
      message: `Chủ đề: ${finalTopic}. Nội dung phản hồi: ${content}`,
    });

    setTopic("");
    setCustomTopic("");
    setEmail("");
    setContent("");
    alert("Đã gửi phản hồi thành công.");
    navigate("/");
  };

  return (
    <div className="p-5 bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Gửi Phản Hồi</h2>

        <label className="block mb-2">
          <span className="text-gray-700">Email:</span>
          <textarea
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full border-2 border-gray-300 rounded p-2"
            rows="1"
            required
          />
        </label>

        <label className="block mb-2">
          <span className="text-gray-700">Chủ đề:</span>
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setCustomTopic(""); // Reset custom topic when a predefined topic is selected
            }}
            className="mt-1 block w-full border-2 border-gray-300 rounded p-2"
            required
          >
            <option value="">Chọn chủ đề</option>
            <option value="về sản phẩm">Về sản phẩm</option>
            <option value="về người bán">Về người bán</option>
            <option value="về trang web">Về trang web</option>
            <option value="về tài khoản">Về tài khoản</option>
            <option value="Khác">Khác</option>
          </select>
        </label>

        {topic === "Khác" && (
          <label className="block mb-2">
            <span className="text-gray-700">Chủ đề tùy chỉnh:</span>
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              className="mt-1 block w-full border-2 border-gray-300 rounded p-2"
              required
            />
          </label>
        )}

        <label className="block mb-2">
          <span className="text-gray-700">Nội dung:</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full border-2 border-gray-300 rounded p-2"
            rows="8"
            required
          />
        </label>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 flex items-center justify-center"
                >
                    <FiSend className="h-5 w-5 mr-2" />
                    Gửi
                </button>
            </form>
        </div>
    );
};

export default Feedback;
