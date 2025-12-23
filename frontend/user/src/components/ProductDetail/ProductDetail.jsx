// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useProduct } from "../../hooks/Products"; // Nhập custom hook
// import { addToCart } from "../../hooks/Carts";
// import BackButton from "../../commons/BackButton";
// import { useReviews } from "../../hooks/Review"; // Import custom hook cho reviews
// import { FaCheckCircle } from "react-icons/fa";
// import { getCartItemsByUserId } from "../../hooks/Carts";
// import { useUserById } from "../../hooks/Users";
// import io from "socket.io-client";
// import axios from "axios";
// import { addConversation, addMessage } from "../../hooks/Message";
// import { IP } from "../../config";

// const socket = io(`http://localhost:5555`);

// const ProductDisplay = () => {
//   const userInfoString = sessionStorage.getItem("userInfo");
//   const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

//   const { id } = useParams();
//   const user_buyer_id = userInfo ? userInfo._id : "";
//   const { product, loading, error } = useProduct(id); // Sử dụng custom hook
//   const { reviews, loadingReviews, errorReviews } = useReviews(id); // Sử dụng hook cho reviews
//   const [quantity, setQuantity] = useState(1);
//   const navigate = useNavigate();

//   const handleQuantityChange = (e) => {
//     const value = Math.max(1, Math.min(product?.quantity || 0, e.target.value)); // Giới hạn số lượng
//     setQuantity(value);
//   };

//   const totalPrice = product ? quantity * product.price : 0;

//   const handleAddToCart = async () => {
//     if (userInfo) {
//       const productInCart = await getCartItemsByUserId(userInfo._id);

//       // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
//       const isProductInCart = productInCart.some(
//         (item) => item.product_id === product._id
//       );

//       if (isProductInCart) {
//         alert("Sản phẩm đã có trong giỏ hàng!");
//       } else {
//         addToCart({
//           user_buyer: userInfo._id,
//           user_seller: product.user_id,
//           product_id: product._id,
//           product_name: product.name,
//           product_quantity: quantity,
//           product_price: product.price,
//           product_imageUrl: product.image_url,
//         });
//         alert("Sản phẩm đã được thêm vào giỏ hàng!");
//         socket.emit("addCart");
//       }
//     } else {
//       alert("Bạn chưa đăng nhập!");
//     }
//   };

//   const handleTextToSeller = async () => {
//     // Kiểm tra xem người dùng có phải là người bán không
//     if (product.user_id === userInfo._id) {
//       alert("Đây là sản phẩm của bạn!");
//       return;
//     }

//     // Lấy danh sách các cuộc hội thoại
//     const response = await axios.get(
//       `http://${IP}:5555/conversations/${userInfo._id}`
//     );
//     const conversations = response.data;

//     // Kiểm tra xem đã có cuộc hội thoại nào giữa userInfo._id và product.user_id chưa
//     const existingConversation = conversations.find(
//       (conversation) =>
//         (conversation.participant1 === userInfo._id &&
//           conversation.participant2 === product.user_id) ||
//         (conversation.participant1 === product.user_id &&
//           conversation.participant2 === userInfo._id)
//     );

//     if (existingConversation) {
//       // Nếu có cuộc hội thoại, chuyển đến trang nhắn tin
//       navigate(`/message/${userInfo._id}/${existingConversation._id}`);
//     } else {
//       // Nếu không, tạo cuộc hội thoại mới
//       const newConversation = await addConversation(
//         userInfo._id,
//         product.user_id
//       );
//       // Chuyển đến trang nhắn tin với cuộc hội thoại mới
//       navigate(`/message/${userInfo._id}/${newConversation._id}`);
//     }
//   };

//   if (error) {
//     return <div className="text-red-500">{error}</div>; // Xử lý lỗi
//   }

//   if (loading) {
//     return <p>Loading...</p>; // Hiển thị loading khi chưa có dữ liệu
//   }

//   return (
//     <div className="p-5 bg-gray-100 min-h-screen">
//       <div className="flex items-center mb-4">
//         <BackButton />
//       </div>
//       <div className="flex max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//         {product && (
//           <>
//             <img
//               src={product.image_url}
//               alt={product.name}
//               className="w-full md:w-1/2 object-cover rounded-lg shadow-lg"
//               style={{ maxHeight: "400px", objectFit: "contain" }}
//             />
//             <div className="ml-6 w-full md:w-1/2">
//               <h2 className="text-2xl font-semibold text-black">
//                 {product.name}
//               </h2>
//               {String(product.partner) === "true" ? ( // So sánh partner với chuỗi "true"
//                 <p className="text-sm text-green-600 mt-1 flex items-center">
//                   <FaCheckCircle className="mr-1" /> {/* Biểu tượng check */}
//                   Đảm bảo
//                 </p>
//               ) : null}
//               <p className="mt-2">
//                 <strong>Số lượng còn lại:</strong> {product.quantity}
//               </p>
//               {product.condition && (
//                 <p className="mt-2">
//                   <strong>Tình trạng:</strong> {product.condition}
//                 </p>
//               )}
//               <p className="mt-4 text-lg font-bold text-black">
//                 Giá: {product.price.toLocaleString()} VNĐ
//               </p>

//               <div className="mt-4 flex items-center">
//                 <label className="mr-2">
//                   <strong>Chọn số lượng:</strong>
//                 </label>
//                 <input
//                   type="number"
//                   min="1"
//                   max={product.quantity}
//                   value={quantity}
//                   onChange={handleQuantityChange}
//                   className="border border-gray-300 rounded p-2 w-20"
//                 />
//               </div>
//               <p className="mt-4 text-lg font-bold text-red-500">
//                 Tổng tiền: {totalPrice.toLocaleString()} VNĐ
//               </p>
//               <div className="flex flex-col md:flex-row md:space-x-4 mb-4 mt-6">
//                 <button
//                   onClick={handleAddToCart}
//                   className="bg-gray-100 text-green-600 font-bold rounded p-2 hover:bg-gray-300 transition duration-300"
//                 >
//                   Thêm vào giỏ hàng
//                 </button>
//                 <button
//                   onClick={() =>
//                     navigate("/checkout", {
//                       state: {
//                         product: {
//                           user_buyer: user_buyer_id,
//                           user_seller: product.user_id,
//                           product_id: product._id,
//                           product_name: product.name,
//                           product_quantity: quantity,
//                           product_price: product.price,
//                           product_imageUrl: product.image_url,
//                         },
//                       },
//                     })
//                   }
//                   className="bg-gray-100 text-red-600 rounded font-bold p-2 hover:bg-gray-300 transition duration-300"
//                 >
//                   Đặt hàng
//                 </button>
//               </div>
//               <button
//                 onClick={handleTextToSeller}
//                 className="bg-gray-100 text-green-600 font-bold rounded p-2 hover:bg-gray-300 transition duration-300"
//               >
//                 Nhắn với người bán
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-7">
//         {/* name, description, price, quantity, category_id, image_url, user_id, createdAt, updatedAt, brand,
//             condition, origin, sellerInfo */}
//         <strong>Thông tin chi tiết sản phẩm</strong>
//         <p className="mt-2">
//           <strong>{product.name}</strong>
//         </p>
//         <p className="mt-2 text-gray-700">{product.description}</p>
//         <p className="mt-2">
//           <strong>Hãng sản xuất:</strong> {product.brand}
//         </p>
//         <p className="mt-2">
//           <strong>Xuất xứ:</strong> {product.origin}
//         </p>
//         <p className="mt-2">
//           <strong>Tình trạng sử dụng:</strong> {product.condition}
//         </p>
//         <p className="mt-2">
//           <strong>Ngày cập nhật:</strong>{" "}
//           {new Date(product.updatedAt).toLocaleDateString()}
//         </p>
//         <button
//           className="bg-gray-100 mt-6 text-blue-600 rounded p-2 hover:bg-gray-300 transition duration-300 w-full md:w-auto mt-4 md:mt-0"
//           onClick={() => navigate(`/seller/${product.user_id}`)}
//         >
//           Xem trang người bán
//         </button>
//       </div>

//       {/* Hiển thị các review */}
//       <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-7">
//         <h2 className="text-xl font-semibold">Đánh giá</h2>
//         {loadingReviews ? (
//           <p>Loading reviews...</p>
//         ) : errorReviews ? (
//           <p className="text-red-500">{errorReviews}</p>
//         ) : reviews.length > 0 ? (
//           <ul className="mt-4">
//             {reviews.map((review) => (
//               <li key={review._id} className="border-b py-2">
//                 <div>
//                   <strong>Rating:</strong>
//                   <div className="flex items-center">
//                     {Array.from({ length: 5 }, (v, i) => (
//                       <span
//                         key={i}
//                         className={`text-lg ${
//                           i < review.rating
//                             ? "text-yellow-500"
//                             : "text-gray-300"
//                         }`}
//                       >
//                         ★
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//                 <div>
//                   <p>{review.comment}</p>
//                 </div>
//                 <div className="text-gray-500 text-sm">
//                   Ngày{" "}
//                   {new Date(review.createdAt).toLocaleDateString("vi-VN", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                   })}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>Chưa có đánh giá nào.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductDisplay;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../../hooks/Products"; // Nhập custom hook
import { addToCart } from "../../hooks/Carts";
import BackButton from "../../commons/BackButton";
import { useReviews } from "../../hooks/Review"; // Import custom hook cho reviews
import { FaCheckCircle } from "react-icons/fa";
import { getCartItemsByUserId } from "../../hooks/Carts";
import io from "socket.io-client";
import axios from "axios";
import { addConversation, addMessage } from "../../hooks/Message";
import { IP } from "../../config";
import ListProductCard from "../Home/ListProducts/ListProductCard";
import { getProductByCategory1 } from "../../hooks/Products";
import { FiShoppingCart, FiCheckCircle, FiMessageCircle, FiStar, FiClipboard, FiUser} from 'react-icons/fi';

const socket = io(`http://localhost:5555`);

const ProductDisplay = () => {
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const { id } = useParams();
    const user_buyer_id = userInfo ? userInfo._id : '';
    const { product, loading, error } = useProduct(id); // Sử dụng custom hook
    const { reviews, loadingReviews, errorReviews } = useReviews(id); // Sử dụng hook cho reviews
    const { products, loadings, errors } = getProductByCategory1(id);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const handleQuantityChange = (e) => {
        const value = Math.max(1, Math.min(product?.quantity || 0, e.target.value)); // Giới hạn số lượng
        setQuantity(value);
    };

    const totalPrice = product ? quantity * product.price : 0;
    
    const handleAddToCart = async () => {
      if ( userInfo && (product.user_id === userInfo._id)) {
        alert("Đây là sản phẩm của bạn!");
        return;
      }
      if (userInfo) {
        const productInCart = await getCartItemsByUserId(userInfo._id);

        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        const isProductInCart = productInCart.some(
          (item) => item.product_id === product._id
        );

        if (isProductInCart) {
          alert("Sản phẩm đã có trong giỏ hàng!");
      } else {
        addToCart({
          user_buyer: userInfo._id,
          user_seller: product.user_id,
          product_id: product._id,
          product_name: product.name,
          product_quantity: quantity,
          product_price: product.price,
          product_imageUrl: product.image_url
            ? product.image_url
            : product.video_url,
          product_weight: product.weight,
        });
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
        socket.emit("addCart");
      }
    } else {
      alert("Bạn chưa đăng nhập!");
    }
  };

  const handleTextToSeller = async () => {
    // Kiểm tra xem người dùng có phải là người bán không
    if ( userInfo && (product.user_id === userInfo._id)) {
      alert("Đây là sản phẩm của bạn!");
      return;
    }

    // Lấy danh sách các cuộc hội thoại
    const response = await axios.get(
      `http://${IP}:5555/conversations/${userInfo._id}`
    );
    const conversations = response.data;

    // Kiểm tra xem đã có cuộc hội thoại nào giữa userInfo._id và product.user_id chưa
    const existingConversation = conversations.find(
      (conversation) =>
        (conversation.participant1 === userInfo._id &&
          conversation.participant2 === product.user_id) ||
        (conversation.participant1 === product.user_id &&
          conversation.participant2 === userInfo._id)
    );

    if (existingConversation) {
      // Nếu có cuộc hội thoại, chuyển đến trang nhắn tin
      navigate(`/message/${userInfo._id}/${existingConversation._id}`);
    } else {
      // Nếu không, tạo cuộc hội thoại mới
      const newConversation = await addConversation(
        userInfo._id,
        product.user_id
      );
      // Chuyển đến trang nhắn tin với cuộc hội thoại mới
      navigate(`/message/${userInfo._id}/${newConversation._id}`);
    }
  };

    if (error) {
      return <div className="text-red-500">{error}</div>; // Xử lý lỗi
    }

    if (loading) {
      return <p>Loading...</p>; // Hiển thị loading khi chưa có dữ liệu
    }

  const media_url = product.image_url || product.video_url;
  const isVideo =
    media_url?.toLowerCase().endsWith(".mp4") ||
    media_url?.toLowerCase().endsWith(".mov") ||
    media_url?.toLowerCase().endsWith(".webm");

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <div className="flex items-center mb-4">
                <BackButton />
            </div>
            <div className="flex max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
                {product && (
                    <>
                        {isVideo ? (
                            <video controls className="w-full md:w-1/2 object-cover shadow-lg" style={{ maxHeight: '400px' }}>
                                <source src={media_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img src={media_url} alt={product.name} className="w-full md:w-1/2 object-cover shadow-lg" style={{ maxHeight: '400px' }} />
                        )}
                        <div className="ml-6 w-full md:w-1/2">
                        <div className="text-black font-bold bg-yellow-400 flex justify-center ">{ userInfo && (product.user_id === userInfo._id) ? <span>Đây là sản phẩm của bạn</span> : null}</div>
                            <div className="flex">
                              <h2 className="text-2xl font-semibold text-black">{product.name}</h2>
                              
                            </div>
                            {/* {String(product.partner) === "true" ? (  // So sánh partner với chuỗi "true"
                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                    <FaCheckCircle className="mr-1" /> 
                                    Đảm bảo                         
                                </p>
                              ) : null} */}
                              <p className="mt-2">
                                Số lượng còn lại: {product.quantity}
                              </p>
                              {product.condition && (
                                <p className="mt-2">
                                  Tình trạng: {product.condition}
                                </p>
                              )}
                              <p className="mt-4 text-lg font-bold text-black">
                                Giá: {product.price.toLocaleString()} VNĐ
                              </p>
                              <div className="mt-4 flex items-center">
                                <label className="mr-2">
                                  Chọn số lượng:
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  max={product.quantity}
                                  value={quantity}
                                  onChange={handleQuantityChange}
                                  className="border border-gray-300 p-2 w-20"
                                />
                              </div>
                              <div className="mt-4 text-lg flex font-bold">
                                Tổng tiền: <span className="ml-2 text-red-500"> {totalPrice.toLocaleString()} VNĐ</span>
                              </div>
                              <div className="flex flex-col md:flex-row md:space-x-4 mb-4 mt-6 items-center">
                                <button
                                  onClick={handleAddToCart}
                                  className="bg-green-500 flex items-center text-white font-bold rounded p-2 hover:bg-green-400 transition duration-300"
                                >
                                  <FiShoppingCart className="h-5 w-5 mr-2" />
                                  Thêm vào giỏ hàng
                                </button>
                                <button
                                onClick={() =>
                                {
                                  if ( userInfo && (product.user_id === userInfo._id)) {
                                    alert("Đây là sản phẩm của bạn!");
                                    return;}
                                  navigate("/checkout", {
                                    state: {
                                      product: {
                                        user_buyer: user_buyer_id,
                                        user_seller: product.user_id,
                                        product_id: product._id,
                                        product_name: product.name,
                                        product_quantity: quantity,
                                        product_price: product.price,
                                        product_imageUrl: product.image_url || product.video_url,
                                        product_weight: product.weight,
                                      },
                                    },
                                  })}
                                }
                                className="bg-red-500 flex items-center text-white rounded font-bold p-2 hover:bg-red-400 transition duration-300"
                              >
                                <FiCheckCircle className="h-5 w-5 mr-2" />
                                Đặt hàng
                              </button>
                              </div>
                              <button
                                onClick={handleTextToSeller}
                                className="bg-green-500 flex items-center text-white font-bold rounded p-2 hover:bg-green-400 transition duration-300"
                              >
                                <FiMessageCircle className="h-5 w-5 mr-2" />
                                Nhắn với người bán
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-7">
                      {/* name, description, price, quantity, category_id, image_url, user_id, createdAt, updatedAt, brand, 
                          condition, origin, sellerInfo */}
                        <div className="flex items-center">
                          <FiClipboard className="h-6 w-6 text-yellow-400 mr-2" />
                          <span className="text-xl font-semibold">Thông tin chi tiết sản phẩm</span>
                      </div>
                      <p className="mt-2">
                        <strong>{product.name}</strong>
                      </p>
                      <p className="mt-2 text-gray-700">{product.description}</p>
                      <p className="mt-2">
                        <strong>Hãng sản xuất:</strong> {product.brand}
                      </p>
                      <p className="mt-2">
                        <strong>Khối lượng:</strong> {product.weight} (g)
                      </p>
                      <p className="mt-2">
                        <strong>Xuất xứ:</strong> {product.origin}
                      </p>
                      <p className="mt-2">
                        <strong>Tình trạng sử dụng:</strong> {product.condition}
                      </p>
                      <p className="mt-2 mb-3">
                        <strong>Ngày cập nhật:</strong>{" "}
                        {new Date(product.updatedAt).toLocaleDateString()}
                      </p>
                      <button
                        className="bg-white flex items-center underline text-blue-600 rounded border-2 p-2 hover:bg-gray-300 transition duration-300 w-full md:w-auto mt-4 md:mt-0"
                        onClick={() => navigate(`/seller/${product.user_id}`)}
                      >
                        <FiUser className="h-5 w-5 mr-2" />
                        Xem trang người bán
                      </button>
                    </div>          
                    {/* Hiển thị các review */}
                    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-5 mb-5">
                        <div className="flex items-center border-b py-2">
                            <FiStar className="h-6 w-6 text-yellow-400 mr-2" />
                            <span className="text-xl font-semibold">Đánh giá</span>
                        </div>
                        {loadingReviews ? (
                            <p>Loading reviews...</p>
                        ) : errorReviews ? (
                            <p className="text-red-500">{errorReviews}</p>
                        ) : (
                            reviews.length > 0 ? (
                                <ul className="mt-4">
                                    {reviews.map(review => (
                                        <li key={review._id} className="border-b py-2">
                                            <div className="flex items-center">
                                                <strong className="mr-2">Đánh giá:</strong>
                                                <div className="flex items-center">
                                                    {Array.from({ length: 5 }, (v, i) => (
                                                        <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p>{review.comment}</p>
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                Ngày {new Date(review.createdAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Chưa có đánh giá nào.</p>
                            )
                        )}
                   </div>
            <div>
                <ListProductCard data={{ products, loading: loadings, error: errors }} w="100%" title="Sản phẩm liên quan"/>
            </div>
        </div>
    );
};

export default ProductDisplay;
