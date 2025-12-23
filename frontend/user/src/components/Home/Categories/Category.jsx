import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

const CategoryItem = ({ category }) => {
  return (
    <Link 
      to={`/product/category/${category._id}`} // Thay đổi đường dẫn theo tham số category.id
      className="category-item m-2 rounded-lg hover:shadow-lg transition-shadow duration-300 inline-flex flex-col items-center justify-center p-4"
      style={{ width: '120px', height: '100px' }} // Tăng kích thước khối danh mục
    >
      <img 
        src={category.image_url} 
        alt={category.category_name} 
        className="object-cover mb-2" // Thêm khoảng cách dưới hình
        style={{ width: '60px', height: '60px', borderRadius: '10px' }} // Giữ kích thước hình ảnh và thêm border-radius
      />
      <div className="text-sm text-gray-800 text-center">{category.category_name}</div>
    </Link>
  );
};

// Định nghĩa prop types
CategoryItem.propTypes = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Đảm bảo category có id
    image_url: PropTypes.string.isRequired,
    category_name: PropTypes.string.isRequired,
  }).isRequired
};

export default CategoryItem;