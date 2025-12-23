import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import useCategory from "../../hooks/useCategory";

function CategoryCustom({ selectedCategory, closeForm }) {
  const [categoryName, setCategoryName] = useState(
    selectedCategory?.category_name || ""
  );
  const [image, setImage] = useState(selectedCategory?.image_url || "");
  const [loadingImage, setLoadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { createCategory, editCategory } = useCategory();

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type (optional)
    if (!file.type.startsWith("image/")) {
      setUploadError("Hãy tải đúng ảnh");
      return;
    }

    setLoadingImage(true);
    setUploadError(null);

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
      if (data.secure_url) {
        setImage(data.secure_url); // Set the image URL after successful upload
      } else {
        setUploadError("Tải ảnh thất bại");
      }
    } catch (error) {
      setUploadError("Lỗi tải ảnh lên: " + error.message);
    } finally {
      setLoadingImage(false);
    }
  };

  // Handle form submission for creating or editing category
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!categoryName || !image) {
      alert("Hãy thêm tên danh mục hoặc ảnh cho danh mục");
      return;
    }

    const categoryData = { category_name: categoryName, image_url: image };

    if (selectedCategory) {
      // Edit existing category
      editCategory(selectedCategory._id, categoryData);
    } else {
      // Create new category
      createCategory(categoryData);
    }
    window.location.reload();
    closeForm();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          {selectedCategory ? "Sửa danh mục" : "Tạo danh mục mới"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tên danh mục
            </label>
            <input
              type="text"
              className="border p-2 w-full rounded"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Ảnh
            </label>
            <input type="file" onChange={handleImageUpload} />
            {loadingImage && <p>Uploading image...</p>}
            {uploadError && <p className="text-red-500">{uploadError}</p>}
            {image && !loadingImage && (
              <img
                src={image}
                alt="Category"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 text-gray-500"
              onClick={closeForm}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {selectedCategory ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// PropTypes validation
CategoryCustom.propTypes = {
  selectedCategory: PropTypes.shape({
    category_name: PropTypes.string,
    image_url: PropTypes.string,
    _id: PropTypes.string,
  }),
  closeForm: PropTypes.func.isRequired,
};

export default CategoryCustom;
