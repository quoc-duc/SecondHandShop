import { useState } from "react";
import useCategory from "../../hooks/useCategory";
import { FaSort } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import CategoryCustom from "./CategoryCustom";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const {
    categories = [],
    loading,
    error,
    totalPages,
    deleteCategory,
  } = useCategory(page, fieldSort, orderSort, searchKey);

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleDeleteSelected = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    if (window.confirm("Are you sure you want to delete selected products?")) {
      deleteCategory(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleSelectOne = (categoryId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id != categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(categories.map((category) => category._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center">
        <select
          className="text-sm border border-black p-2 mb-4"
          defaultValue="choose"
          onChange={(e) => {
            if (e.target.value == "deleteCategories") {
              handleDeleteSelected();
              e.target.value = "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Chọn hành động...
          </option>
          <option value="deleteCategories">Xóa danh mục đã chọn</option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Tìm kiếm theo tên danh mục..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="submit" className="m-2 rounded text-blue-600">
              <FaSearch />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    categories.length > 0 &&
                    selectedCheckBox.length === categories.length
                  }
                />
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                Ảnh danh mục
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                <span className="inline-flex items-center gap-x-2">
                  Tên danh mục{" "}
                  <FaSort onClick={() => handleSort("category_name")} />
                </span>
              </th>
              <th className="text-sm px-2 py-2 text-center font-boldborder">
                Tùy chỉnh
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <tr key={category._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(category._id)}
                      onChange={() => handleSelectOne(category._id)}
                    />
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <img
                      src={category.image_url}
                      alt={category.category_name}
                      className="w-16 h-16 rounded mr-4"
                    />
                  </td>
                  <td className="text-sm border px-4 py-2">
                    <Link
                      to={`/admin/category/${category._id}/details`}
                      className="text-blue-500 hover:underline"
                    >
                      {category.category_name}
                    </Link>
                  </td>
                  <td className="border px-2 py-2 text-center">
                    <button
                      className="px-2 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => setSelectedCategory(category)}
                    >
                      <FaPen />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Không có danh mục.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedCategory !== null && (
          <CategoryCustom
            selectedCategory={selectedCategory}
            closeForm={() => setSelectedCategory(null)}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Trước
        </button>
        <span className="px-3 py-1 mx-2">
          Trang {page} của {totalPages}
        </span>
        <button
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default CategoryList;
