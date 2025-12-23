import { useState } from "react";
import useNotification from "../../hooks/useNotification";
import { TbListDetails } from "react-icons/tb";

const NotificationList = () => {
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedCheckBox, setSelectedCheckBox] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const {
    notifications = [],
    loading,
    error,
    totalPages,
    removeNotification,
  } = useNotification(page);

  const handleDeleteNotification = () => {
    if (selectedCheckBox.length === 0) {
      alert("Chọn ít nhất 1 thông báo");
      return;
    }
    if (window.confirm("Bạn có muốn xóa thông báo")) {
      removeNotification(selectedCheckBox);
      setSelectedCheckBox([]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCheckBox(
        notifications.map((notification) => notification._id)
      );
    } else {
      setSelectedCheckBox([]);
    }
  };

  const handleSelectOne = (partnerId) => {
    setSelectedCheckBox((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id != partnerId)
        : [...prev, partnerId]
    );
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="">
        <select
          className="text-sm border border-black p-2 mb-4"
          defaultValue="choose"
          onChange={(e) => {
            if (e.target.value == "deleteRolePartners") {
              handleDeleteNotification();
              e.target.value = "choose";
            }
          }}
        >
          <option value="choose" disabled>
            Choose action...
          </option>
          <option value="deleteRolePartners">Xóa các thông báo</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-sm px-4 py-2 text-center font-bold text-gray-600 border">
                <input
                  type="checkbox"
                  checked={
                    notifications.length > 0 &&
                    selectedCheckBox.length === notifications.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th className="text-sm border px-2 py-2">Nội dung thông báo</th>
              <th className="text-sm border px-4 py-2">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(notifications) && notifications.length > 0 ? (
              notifications.map((notification) => (
                <tr key={notification._id} className="border">
                  <td className="text-sm px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCheckBox.includes(notification._id)}
                      onChange={() => handleSelectOne(notification._id)}
                    />
                  </td>

                  <td className="border px-2 py-2 text-sm ">
                    {notification.message}
                  </td>
                  <th className="border px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(notification)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <TbListDetails />
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center">
                  Không có thông báo.
                  {console.log(notifications)}
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

      {isPopupOpen && selectedNotification && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="text-sm border px-4 py-2 font-bold">
                    Người nhận
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {selectedNotification.user_id_receive}
                  </td>
                </tr>
                <tr>
                  <td className="text-sm border px-4 py-2 font-bold">
                    Nội dung
                  </td>
                  <td className="text-sm border px-4 py-2">
                    {selectedNotification.message}
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
    </div>
  );
};

export default NotificationList;
