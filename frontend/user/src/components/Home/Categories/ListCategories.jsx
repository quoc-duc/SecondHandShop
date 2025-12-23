import React from "react";
import CategoryItem from "./Category";
import { getCategories } from '../../../hooks/Categories';

const ListCategories = () => {
  const { categories } = getCategories();

  return (
    <div className="w-4/5 mx-auto p-4 bg-white rounded-lg shadow-md my-4">
    {/* Tiêu đề danh mục */}
    <h3 className="text-xl font-bold mb-4">Danh mục sản phẩm</h3>
    
    <div className="flex flex-wrap justify-center -mx-2">
        {categories.map((category, index) => (
            <CategoryItem key={index} category={category} />
        ))}
    </div>
</div>
  );
};

export default ListCategories;