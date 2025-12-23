import React from "react";
import ProductCard from "./ProductCard";

const ListProductCard = ({ data, w, title }) => {
  const { products, loading, error } = data;

  return (
    <div
      className="flex flex-col bg-white items-start rounded-lg"
      style={{ width: w || "93%" }}
    >
      <h1 className="text-2xl font-bold mb-4 ml-4 mt-4">
        {title || "Danh sách sản phẩm"}
      </h1>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block relative w-20 h-20 animate-spin">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-gray-500 rounded-full"></div>
          </div>
          <span className="ml-4 text-gray-500">Loading products...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 font-bold">Error: {error}</div>
      ) : (
        <div className="flex flex-wrap mt-2 mb-2 bg-white justify-center items-center">
          <div className="flex flex-wrap justify-start items-start">
            {Array.isArray(products) &&
              products.map((product) => {
                const mediaUrl = product.video_url || product.image_url;
                return (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    quantity={product.quantity}
                    media_url={mediaUrl} // Chuyển vào thuộc tính media_url
                    partner={product.partner}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProductCard;
