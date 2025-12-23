import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoryDetails } from "../../hooks/useCategoryDetail.js";
import { FaPlus, FaEdit, FaTrash, FaAngleDoubleLeft } from "react-icons/fa";
import axios from "axios";

const CategoryDetailList = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { categoryDetails, loading, error, createCategoryDetail, refetch } =
    useCategoryDetails(categoryId);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategoryDetail, setSelectedCategoryDetail] = useState(null);
  const [newCategoryDetail, setNewCategoryDetail] = useState({
    name: "",
    image_url: "",
    status: true,
  });
  const [formError, setFormError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file); // Use selected file here
    formData.append("upload_preset", "images_preset");
    formData.append("cloud_name", "dd6pnq2is");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dd6pnq2is/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      setFormError("Failed to upload image");
      return null;
    }
  };

  const handleCreateCategoryDetail = async (e) => {
    e.preventDefault();
    try {
      const file = fileInputRef.current?.files[0];
      let imageUrl = newCategoryDetail.image_url;

      if (file) {
        imageUrl = await handleImageUpload(file);
        if (!imageUrl) return;
      }

      await createCategoryDetail({ ...newCategoryDetail, image_url: imageUrl });
      setIsCreateModalOpen(false);
      setNewCategoryDetail({ name: "", image_url: "", status: true });
      setFormError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleEditCategoryDetail = async (e) => {
    e.preventDefault();
    try {
      const file = fileInputRef.current?.files[0];
      let imageUrl = selectedCategoryDetail.image_url;

      if (file) {
        imageUrl = await handleImageUpload(file);
        if (!imageUrl) return;
      }

      await axios.put(
        `http://localhost:5555/admin/sub-category/${selectedCategoryDetail._id}`,
        { ...selectedCategoryDetail, image_url: imageUrl }
      );
      setIsEditModalOpen(false);
      setSelectedCategoryDetail(null);
      setFormError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetch();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this category detail?")
    ) {
      try {
        await axios.delete(`http://localhost:5555/admin/sub-category/${id}`);
        refetch();
      } catch (err) {
        alert(err.response?.data?.message || "Error deleting category detail");
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/category")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-gray-600"
          >
            <FaAngleDoubleLeft />
          </button>
          <h2 className="text-xl font-bold">Danh mục con</h2>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-blue-600"
        >
          <FaPlus /> Thêm mới
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {/* {error && <p className="text-red-500">{error}</p>} */}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center">Tên</th>
              <th className="border px-4 py-2 text-center">Trạng thái</th>
              <th className="border px-4 py-2 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categoryDetails.length > 0 ? (
              categoryDetails.map((detail) => (
                <tr key={detail._id} className="border">
                  <td className="border px-4 py-2 text-sm">{detail.name}</td>

                  <td className="border px-4 py-2 text-sm text-center">
                    {detail.status ? "Active" : "Inactive"}
                  </td>
                  <td className="border px-4 py-2 text-sm text-center">
                    <button
                      onClick={() => {
                        setSelectedCategoryDetail(detail);
                        setIsEditModalOpen(true);
                      }}
                      className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(detail._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Không có danh mục con nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Tạo danh mục con mới</h3>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleCreateCategoryDetail}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tên</label>
                <input
                  type="text"
                  value={newCategoryDetail.name}
                  onChange={(e) =>
                    setNewCategoryDetail({
                      ...newCategoryDetail,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newCategoryDetail.status}
                    onChange={(e) =>
                      setNewCategoryDetail({
                        ...newCategoryDetail,
                        status: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Hiện
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormError(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedCategoryDetail && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Chỉnh sửa thông tin</h3>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleEditCategoryDetail}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tên</label>
                <input
                  type="text"
                  value={selectedCategoryDetail.name}
                  onChange={(e) =>
                    setSelectedCategoryDetail({
                      ...selectedCategoryDetail,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategoryDetail.status}
                    onChange={(e) =>
                      setSelectedCategoryDetail({
                        ...selectedCategoryDetail,
                        status: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Hiện
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategoryDetail(null);
                    setFormError(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetailList;
