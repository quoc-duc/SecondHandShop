import { useState } from "react";
import useNotification from "../../hooks/useNotification";

const NotificationPost = ({ closeForm }) => {
  const { postNotification, loading, error } = useNotification();

  const [message, setMessage] = useState("");
  const [role, setRole] = useState(""); // Role can be 'user', 'partner', or 'all' for all users
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the payload based on the selected role
    const payload = {
      message,
      user_id_created: "YourUserId", // Replace with actual creator ID
    };

    // If role is selected as 'all', don't add it to the payload
    if (role && role !== "all") {
      payload.role = [role];
    }

    try {
      const response = await postNotification(payload);
      setSuccessMessage("Thông báo gửi thành công!");
      console.log("Posted Notification:", response);
      window.location.reload();
    } catch (err) {
      console.error("Thông báo gửi thất bại:", err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Tạo thông báo mới
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between space-y-6 h-full"
        >
          {/* Message Input */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Nội dung:
            </label>
            <input
              id="message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nội dung"
            />
          </div>

          {/* Role Dropdown */}
          {/* <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Send to Role (Optional):
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Role --</option>
              <option value="user">User</option>
              <option value="partner">Partner</option>
              <option value="all">All</option>
            </select>
          </div> */}

          {/* Success and Error Messages */}
          {successMessage && (
            <p className="mt-4 text-green-600 text-center">{successMessage}</p>
          )}
          {error && (
            <p className="mt-4 text-red-600 text-center">Error: {error}</p>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white font-semibold rounded-md ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } focus:outline-none w-full`}
            >
              {loading ? "Posting..." : "Gửi"}
            </button>
            <button
              type="button"
              className="mt-4 text-gray-500"
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

export default NotificationPost;
