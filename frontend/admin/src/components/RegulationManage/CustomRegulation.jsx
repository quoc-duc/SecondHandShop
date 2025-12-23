import { useState, useEffect } from "react";

const EditRegulationModal = ({ regulation, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (regulation) {
      setTitle(regulation.title);
      setDescription(regulation.description);
    }
  }, [regulation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(regulation._id, { title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <h2 className="text-xl font-bold mb-4">Sửa quy định</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Tiêu đề</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">mô tả</label>
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRegulationModal;
