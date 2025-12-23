import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaComments,
  FaListAlt,
  FaBell,
  FaShoppingCart,
  FaSignOutAlt,
} from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdRateReview } from "react-icons/md";
import { useAuth } from "../hooks/useAuth";

const LeftSidebar = () => {
  const [activeLink, setActiveLink] = useState(""); // default active link
  const { logout } = useAuth();

  // Function to handle active link
  const handleLinkClick = (link) => {
    setActiveLink(link);
    localStorage.setItem("activeLink", link); // Save active link to localStorage
  };

  // Load active link from URL or localStorage when the component mounts
  useEffect(() => {
    const savedLink = localStorage.getItem("activeLink");
    const currentPath = window.location.pathname; // Get current path
    setActiveLink(savedLink || currentPath);
  }, []);

  return (
    <div className="w-64 bg-white text-blue-500 h-full flex flex-col">
      <div className="flex items-center justify-center">
        <img
          src="../../images/logo.png"
          alt="Logo"
          className="h-13 max-w-[10em]"
        />
      </div>

      <div className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              onClick={() => handleLinkClick("/")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <FaTachometerAlt className="mr-2" /> Trang quản trị
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              onClick={() => handleLinkClick("/admin/users")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/users"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <FaUsers className="mr-2" /> Quản lý tài khoản
            </Link>
          </li>
          <li>
            <Link
              to="/admin/category"
              onClick={() => handleLinkClick("/admin/category")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/category"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <BiSolidCategoryAlt className="mr-2" /> Quản lý danh mục
            </Link>
          </li>
          <li>
            <Link
              to="/admin/posts"
              onClick={() => handleLinkClick("/admin/posts")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/posts"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <FaBoxOpen className="mr-2" /> Quản lý bài đăng
            </Link>
          </li>
          <li>
            <Link
              to="/admin/feedbacks"
              onClick={() => handleLinkClick("/admin/feedbacks")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/feedbacks"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <FaComments className="mr-2" /> Quản lý phản hồi
            </Link>
          </li>

          <li>
            <Link
              to="/admin/order"
              onClick={() => handleLinkClick("/admin/order")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/order"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <FaShoppingCart className="mr-2" /> Quản lý đơn hàng
            </Link>
          </li>
          <li>
            <Link
              to="/admin/notifications"
              onClick={() => handleLinkClick("/admin/notifications")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/notifications"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <FaBell className="mr-2" /> Quản lý thông báo
            </Link>
          </li>
          <li>
            <Link
              to="/admin/regulation"
              onClick={() => handleLinkClick("/admin/regulation")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/regulation"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <FaListAlt className="mr-2" /> Quản lý quy định
            </Link>
          </li>
          <li>
            <Link
              to="/admin/review"
              onClick={() => handleLinkClick("/admin/review")}
              className={`flex items-center text-sm p-2 rounded ${
                activeLink === "/admin/review"
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-blue-300 hover:text-white"
              }`}
            >
              <MdRateReview className="mr-2" /> Quản lý đánh giá sản phẩm
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                const confirmLogout = window.confirm(
                  "Are you sure you want to log out?"
                );
                if (confirmLogout) {
                  localStorage.removeItem("activeLink");
                  logout();
                }
              }}
              className="w-full flex items-center text-sm p-2 rounded text-red-500 hover:bg-red-500 hover:text-white"
            >
              <FaSignOutAlt className="mr-2" /> Đăng xuất
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
