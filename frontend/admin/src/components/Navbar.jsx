import React from "react";
// Import các icon từ react-icons
import { FaSearch, FaBell } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="bg-white px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <input
          type="text"
          className="p-2 rounded border border-gray-300 w-64"
          placeholder="Search product, supplier, order"
        />
        {/* Biểu tượng tìm kiếm */}
        <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <FaSearch className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        {/* Biểu tượng chuông thông báo */}
        <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <FaBell className="w-6 h-6 text-gray-600" />
        </button>
        <img
          src="https://www.w3schools.com/w3images/avatar2.png"
          alt="User"
          className="w-10 h-10 rounded-full border-2 border-gray-300"
        />
      </div>
    </nav>
  );
};

export default Navbar;
