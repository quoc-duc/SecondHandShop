import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByIdSeller, getProductsNotApproveByIdSeller, getProductsSoldOutByIdSeller } from '../../hooks/Products'; // Giả sử bạn đã có hook này
import BackButton from '../../commons/BackButton';
import { useUserById } from '../../hooks/Users';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { deleteProductById } from '../../hooks/Products';
import nonAvata from '../../assets/img/nonAvata.jpg'

const EditSalePage = () => {
    const { sellerId } = useParams();
    const { products, loading, error } = getProductsByIdSeller(sellerId);
    const { productsnotapprove, loadingnotapprove, errornotapprove } = getProductsNotApproveByIdSeller(sellerId);
    const { productsSoldOut, loadingSoldOut, errorSoldOut } = getProductsSoldOutByIdSeller(sellerId); // Sử dụng hook để lấy sản phẩm sold out
    const sellerInfo = useUserById(sellerId);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("approved"); // Quản lý tab đang hoạt động

    const handleDeleteProduct = async (idPro) => {
        const confirmed = window.confirm("Bạn có muốn xóa sản phẩm ra khỏi danh sách sản phẩm của bạn không?");
        
        if (confirmed) {
            try {
                await deleteProductById(idPro);
                navigate(0);
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const ProductCard = ({ id, name, description, price, quantity, media_url, partner }) => {
        const isVideo = media_url?.toLowerCase().endsWith('.mp4') || media_url?.toLowerCase().endsWith('.mov') || media_url?.toLowerCase().endsWith('.webm');
        return (
            <div className="flex mt-2 mb-2 justify-center items-center" style={{ width: '300px', height: '450px' }}>
                <div className="bg-white h-full border rounded-lg shadow-md p-2 m-2 transition-shadow duration-300">
                    <div className="w-full h-[55%] overflow-hidden rounded-t-lg">
                        {isVideo ? (
                            <video className="object-cover w-full h-full">
                                <source src={media_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img 
                                src={media_url} 
                                alt={name} 
                                className="object-cover" 
                                style={{ width: '250px', height: '200px' }} 
                            />
                        )}
                    </div>
                    <div className="w-full h-[45%] p-4">
                        <div className="overflow-y-auto h-[75%]">
                            <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                            {String(partner) === "true" ? (
                                <p className="text-sm text-green-600 mt-1 flex items-center">
                                    <FaCheckCircle className="mr-1" />
                                    Đảm bảo
                                </p>
                            ) : null}
                            <p className="text-lg font-bold text-gray-800 mt-2">{price.toLocaleString('vi-VN')} VNĐ</p>
                            <p className="text-gray-500">Số lượng: {quantity}</p>
                        </div>
                        <div className="flex justify-between mt-4">
                            <Link to={`/edit/product/${id}`} className="bg-gray-100 border border-blue-500 text-blue-600 underline rounded p-2 hover:bg-gray-300 transition duration-300">
                                Chỉnh sửa
                            </Link>
                            <button 
                            onClick={() => handleDeleteProduct(id)}
                            className="bg-gray-100 border border-red-600 text-red-600 underline rounded p-2 hover:bg-red-300 transition duration-300">
                                Xoá
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-5 bg-gray-100">
            <div className="flex items-center mb-4">
                <BackButton />
            </div>
            <div className=" flex flex justify-start items-start">
                <div className="w-1/4 p-4 border rounded-lg flex flex-col justify-center items-center">
                    <div className="w-full h-45 overflow-hidden mt-4 flex flex-col justify-center items-center">
                        {sellerInfo.avatar_url ? (
                            <img src={sellerInfo.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full" />
                        ) : (
                            <img src={nonAvata} alt="Avatar" className="w-32 h-32 object-cover rounded-full" />
                        )}
                        <h2 className="text-xl font-semibold mt-4">{sellerInfo.name}</h2>
                    </div>
                    <div>
                        <p className="mt-2 ml-4">Số điện thoại: {sellerInfo.phone}</p>
                        <p className="mt-2 ml-4">Địa chỉ: {sellerInfo.address}</p>
                        <p className="mt-2 ml-4">Email: {sellerInfo.email}</p>
                    </div>
                    {/* <div className="flex flex-col justify-center items-center text-center">
                        <h2 className="text-xl font-semibold mt-4">Mã QR thanh toán</h2>
                        {sellerInfo.qrPayment ? (
                            <img 
                                src={sellerInfo.qrPayment} 
                                alt="Mã QR" 
                                className="w-60 h-auto border rounded mb-4" 
                            />
                        ) : (
                            <div className="text-xl font-bold mb-2">Chưa có</div>
                        )}
                    </div> */}
                    <button 
                        onClick={() => navigate(`/profile/${sellerId}`)}
                        className="bg-gray-100 border border-blue-500 text-blue-600 underline rounded p-2 hover:bg-gray-300 transition duration-300"
                    >
                        Cập nhật thông tin cá nhân
                    </button>
                </div>
                <div className="w-3/4 p-4">
                    <div className="flex mb-4">
                        <button 
                            onClick={() => setActiveTab("approved")} 
                            className={`p-2 rounded w-1/3 ${activeTab === "approved" ? "bg-blue-100 text-blue-600 font-bold underline border border-blue-500" : "bg-gray-200 text-gray-700"}`}>
                            Sản phẩm được xét duyệt
                        </button>
                        <button 
                            onClick={() => setActiveTab("soldOut")} 
                            className={`p-2 rounded w-1/3 ${activeTab === "soldOut" ? "bg-blue-100 text-blue-600 font-bold underline border border-blue-500" : "bg-gray-200 text-gray-700"}`}>
                            Sản phẩm đã bán hết
                        </button>
                        <button 
                            onClick={() => setActiveTab("notApproved")} 
                            className={`p-2 rounded w-1/3 ${activeTab === "notApproved" ? "bg-blue-100 text-blue-600 font-bold underline border border-blue-500" : "bg-gray-200 text-gray-700"}`}>
                            Sản phẩm đang chờ xét duyệt
                        </button>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-center items-center bg-main overflow-x-hidden">
                        <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
                        {activeTab === "approved" && (loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="inline-block relative w-20 h-20 animate-spin">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-gray-500 rounded-full"></div>
                                </div>
                                <span className="ml-4 text-gray-500">Loading products...</span>
                            </div>
                        ) : error ? (
                            <div className="text-red-500 font-bold">{error}</div>
                        ) : (
                            <div className="flex flex-wrap mt-2 mb-2">
                                {Array.isArray(products) && products.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        quantity={product.quantity}
                                        media_url={product.image_url || product.video_url}
                                        partner={product.partner}
                                    />
                                ))}
                            </div>
                        ))}
                        {activeTab === "notApproved" && (loadingnotapprove ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="inline-block relative w-20 h-20 animate-spin">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-gray-500 rounded-full"></div>
                                </div>
                                <span className="ml-4 text-gray-500">Loading products...</span>
                            </div>
                        ) : errornotapprove ? (
                            <div className="text-red-500 font-bold">{errornotapprove}</div>
                        ) : (
                            <div className="flex flex-wrap mt-2 mb-2">
                                {Array.isArray(productsnotapprove) && productsnotapprove.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        quantity={product.quantity}
                                        media_url={product.image_url || product.video_url}
                                        partner={product.partner}
                                    />
                                ))}
                            </div>
                        ))}
                        {activeTab === "soldOut" && (loadingSoldOut ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="inline-block relative w-20 h-20 animate-spin">
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-4 border-gray-500 rounded-full"></div>
                                </div>
                                <span className="ml-4 text-gray-500">Loading products...</span>
                            </div>
                        ) : errorSoldOut ? (
                            <div className="text-red-500 font-bold">{errorSoldOut}</div>
                        ) : (
                            <div className="flex flex-wrap mt-2 mb-2">
                                {Array.isArray(productsSoldOut) && productsSoldOut.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        id={product._id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        quantity={product.quantity}
                                        media_url={product.image_url || product.video_url}
                                        partner={product.partner}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSalePage;