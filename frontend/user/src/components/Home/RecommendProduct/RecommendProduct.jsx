// import React, { useEffect, useState } from "react";
// import getRecommendationProduct from "../../../hooks/Recommendation";
// import ProductCard from "./ProductCard";

// const RecommendedProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const userInfoString = sessionStorage.getItem("userInfo");
//     const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

//     const fetchRecommended = async () => {
//       if (userInfo && userInfo._id) {
//         try {
//           const data = await getRecommendationProduct(userInfo._id);
//           setProducts(data);
//         } catch (error) {
//           console.error("Failed to load recommended products:", error);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     fetchRecommended();
//   }, []);

//   if (loading) return <p>Đang tải gợi ý...</p>;
//   if (!products.length) return <p>Không có sản phẩm gợi ý.</p>;

//   return (
//     <div className="flex flex-col bg-white items-center rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Sản phẩm có thể bạn thích</h2>
//       <div className="mt-2 mb-2 bg-white justify-center items-center">
//         <div
//           className="flex flex-wrap justify-start items-center"
//           style={{ width: "1225px" }}
//         >
//           {products.map((product) => (
//             <ProductCard
//               key={product._id}
//               id={product._id}
//               name={product.name}
//               description={product.description}
//               price={product.price}
//               quantity={product.quantity}
//               image_url={product.image}
//               partner={product.partner}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecommendedProducts;

import { useEffect, useState } from "react";
import getRecommendationProduct from "../../../hooks/Recommendation";
import ProductCard from "../ListProducts/ProductCard";

const RecommendedProducts = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10); // hiển thị ban đầu
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfoString = sessionStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const fetchRecommended = async () => {
      if (userInfo && userInfo._id) {
        try {
          const data = await getRecommendationProduct(userInfo._id);
          setProducts(data);
        } catch (error) {
          console.error("Failed to load recommended products:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading) return null;
  if (!products.length) return null;

  return (
    <div className="flex flex-col bg-white items-center rounded-lg my-4">
      <h2 className="text-xl font-bold mb-4">Sản phẩm có thể bạn thích</h2>
      <div className="mt-2 mb-2 bg-white justify-center items-center">
        <div
          className="flex flex-wrap justify-start items-center"
          style={{ width: "1225px" }}
        >
          {Array.isArray(products) &&
            products.slice(0, visibleCount).map((product) => {
              const mediaUrl =
                product.video_url && product.video_url.length > 0
                  ? product.video_url[0]
                  : product.image_url;

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

        {/* Nút xem thêm nếu còn sản phẩm */}
        <div className="mt-4 flex justify-center">
          {visibleCount < products.length ? (
            <button
              onClick={() => setVisibleCount((prev) => prev + 10)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Xem thêm
            </button>
          ) : products.length > 10 ? (
            <button
              onClick={() => setVisibleCount(10)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Ẩn bớt
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;
