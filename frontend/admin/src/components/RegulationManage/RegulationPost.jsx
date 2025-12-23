import { useState } from "react";
import useRegulation from "../../hooks/useRegulation";

const RegulationPost = ({ onRegulationPosted, closeForm }) => {
  // Thêm prop để thông báo khi regulation được đăng
  const [newRegulation, setNewRegulation] = useState({
    title: "",
    description: "",
    status: true, // Default to active
  });
  const { postRegulation, loading, success, error } = useRegulation();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRegulation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Post regulation to the server
  const handlePostRegulation = async (e) => {
    e.preventDefault();
    try {
      await postRegulation(newRegulation); // Call the postRegulation function from useRegulation
      setNewRegulation({ title: "", description: "", status: true }); // Reset form
      if (onRegulationPosted) {
        onRegulationPosted(); // Gọi hàm callback để cập nhật danh sách regulations
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl text-center font-semibold mb-4">
          Tạo quy định mới
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">Tạo thành công!</p>
        )}

        <form onSubmit={handlePostRegulation} className="space-y-10 mx-10">
          <div>
            <label htmlFor="title" className="block text-sm text-gray-700 mb-2">
              Tiêu đề
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newRegulation.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm text-gray-700 mb-2"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={newRegulation.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[100px]"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md focus:outline-none hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Posting..." : "Tạo"}
            </button>
            <button
              type="button"
              className="mr-4 text-gray-500"
              onClick={closeForm}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegulationPost;
