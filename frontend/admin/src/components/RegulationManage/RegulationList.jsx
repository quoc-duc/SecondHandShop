import { useState } from "react";
import useRegulation from "../../hooks/useRegulation";
import { TbListDetails } from "react-icons/tb";
import { FaSort, FaSearch, FaPen } from "react-icons/fa";
import EditRegulationModal from "./CustomRegulation";

const RegulationList = () => {
  const [page, setPage] = useState(1);
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const [editingRegulation, setEditingRegulation] = useState(null);

  const {
    regulations = [],
    loading,
    error,
    totalPages,
    deleteRegulation,
    customRegulation,
  } = useRegulation(page, fieldSort, orderSort, searchKey);

  const handleSaveEdit = async (id, updatedData) => {
    await customRegulation(id, updatedData);
    setEditingRegulation(null); // Đóng popup sau khi lưu
  };

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleDeleteSelected = () => {
    if (selectedCheckBox.length === 0) {
      alert("Please select at least one regulation.");
      return;
    }
    if (
      window.confirm("Are you sure you want to delete selected regulations?")
    ) {
      deleteRegulation(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleSelectOne = (regulationId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(regulationId)
        ? prev.filter((id) => id != regulationId)
        : [...prev, regulationId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(regulations.map((regulation) => regulation._id));
    } else {
      setSelectedCheckBox([]);
    }
  };

  const handleViewDetails = (regulation) => {
    setSelectedRegulation(regulation);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedRegulation(null);
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
            if (e.target.value == "deleteRegulations") {
              handleDeleteSelected();
              e.target.value = "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Chọn hành động
          </option>
          <option value="deleteRegulations">Xóa những quy định</option>
        </select>
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1 ml-4">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
              type="search"
              name="search"
              placeholder="Tìm kiếm theo tiêu đề..."
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
                  checked={
                    regulations.length > 0 &&
                    selectedCheckBox.length === regulations.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                <span className="inline-flex items-center gap-x-2">
                  Tiêu đề <FaSort onClick={() => handleSort("title")} />
                </span>
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                <span className="inline-flex items-center gap-x-2">
                  Mô tả <FaSort onClick={() => handleSort("description")} />
                </span>
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                Chi tiết
              </th>
              <th className="text-sm px-4 py-2 text-center font-bold border">
                Chỉnh sửa
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(regulations) && regulations.length > 0 ? (
              regulations.map((regulation) => (
                <tr key={regulation._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(regulation._id)}
                      onChange={() => handleSelectOne(regulation._id)}
                    />
                  </td>

                  <td className="border px-2 py-2 text-sm ">
                    {regulation.title}
                  </td>
                  <td className="border px-2 py-2 text-sm ">
                    {regulation.description}
                  </td>

                  <th className="border px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(regulation)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <TbListDetails />
                    </button>
                  </th>
                  <th className="border px-4 py-2">
                    <button
                      onClick={() => setEditingRegulation(regulation)}
                      className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      <FaPen />
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Không có quy định.
                  {console.log(regulations)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Trước
        </button>
        <span className="text-sm px-3 py-1 mx-2">
          Trang {page} của {totalPages}
        </span>
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sau
        </button>
      </div>

      {isPopupOpen && selectedRegulation && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="text-sm border px-4 py-2 font-bold">
                    Quy định
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {selectedRegulation.title}
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border px-4 py-2 font-bold">
                    nội dung
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {selectedRegulation.description}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closePopup}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {editingRegulation && (
        <EditRegulationModal
          regulation={editingRegulation}
          onClose={() => setEditingRegulation(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default RegulationList;
