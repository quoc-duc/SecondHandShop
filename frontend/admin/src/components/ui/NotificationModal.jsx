import React from "react";

const NotificationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <p className="text-gray-800 text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="bg-gray-300 text-black px-4 py-1 rounded hover:bg-gray-400"
            >
              Hủy
            </button>
          )}
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
