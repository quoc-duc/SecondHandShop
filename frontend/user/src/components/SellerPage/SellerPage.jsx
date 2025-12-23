import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByIdSeller } from '../../hooks/Products'; // Giả sử bạn đã có hook này
import BackButton from '../../commons/BackButton';
import { useUserById } from '../../hooks/Users';
import { FaCheckCircle } from 'react-icons/fa';
import nonAvata from '../../assets/img/nonAvata.jpg'
import { FiPhone, FiMapPin, FiMail, FiCalendar, FiPackage   } from 'react-icons/fi';
import { formatDate } from '../../utils/format';

const ProductCard1 = ({ id, name, description, price, quantity, media_url, partner }) => {
    const isVideo = media_url.toLowerCase().endsWith('.mp4') || media_url.toLowerCase().endsWith('.mov') || media_url.toLowerCase().endsWith('.avi') || media_url.toLowerCase().endsWith('.wmv');
    return (
        <Link to={`/product/${id}`} className="flex mt-2 mb-2 justify-center border-2 border-white items-center hover:bg-gray-200" style={{ width: '225px', height: '350px', textDecoration: 'none' }}>
            <div className="bg-white h-full w-[95%] border shadow-md p-2 m-2 transition-shadow duration-300">
                <div className="w-full h-[55%] overflow-hidden rounded-t-lg">
                    {isVideo ? (
                        <video className="object-cover" style={{ width: '225px', height: '200px' }}>
                            <source src={media_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img src={media_url} 
                            alt={name} 
                            className="object-cover" 
                            style={{ width: '225px', height: '200px' }}/>
                    )}
                </div>
                <div className="w-full h-[45%] p-4 overflow-y-auto">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{name}</h2>
                    {/* {String(partner) === "true" ? (  // So sánh partner với chuỗi "true"
                        <p className="text-sm text-green-600 mt-1 flex items-center">
                            <FaCheckCircle className="mr-1" />
                            Đảm bảo chất lượng
                        </p>
                    ) : null} */}
                    <p className="text-lg font-bold text-gray-800 mt-2">{price.toLocaleString('vi-VN')} VNĐ</p>
                    <p className="text-gray-500">Số lượng: {quantity}</p>
                </div>
            </div>
        </Link>
    );
};

const SellerPage = () => {
    const { sellerId } = useParams();
    const { products, loading, error } = getProductsByIdSeller(sellerId);
    const sellerInfo = useUserById(sellerId);

    return (
        <div className="p-5 h-min-screen min-h-screen">
            <div className="flex items-center mb-4">
                <BackButton />
            </div>
        <div className='flex'>
            <div className="w-[25%] p-4 flex flex-col justify-start items-center"> 
                <div className='rounded-md border-2 border-yellow-400'>
                    <div className="w-full h-45 overflow-hidden mt-4 flex flex-col justify-start items-center ">
                        {sellerInfo.avatar_url ? (
                        <img src={sellerInfo.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full border-2 border-yellow-400" />
                        ) : (
                            <img src={nonAvata} alt="Avatar" className="w-32 h-32 object-cover rounded-full" />
                        )}
                        <div className="items-center bg-yellow-400 mt-2 mb-2 rounded-md">
                            <h2 className="text-xl font-semibold text-center m-2">{sellerInfo.name}</h2>
                        </div>
                        
                    </div>
                    <div className='bg-gray-100 mb-2 p-4'>
                        <div className="flex items-center mt-2">
                            <FiPhone className="h-5 w-5 text-yellow-400 mr-2" />
                            <p>Số điện thoại: {sellerInfo.phone}</p>
                        </div>
                        <div className="flex items-center mt-2">
                            <FiMapPin className="h-5 w-5 text-yellow-400 mr-2" />
                            <p>Địa chỉ: {sellerInfo.address}</p>
                        </div>
                        <div className="flex items-center mt-2">
                            <FiMail className="h-5 w-5 text-yellow-400 mr-2" />
                            <p>Email: {sellerInfo.email}</p>
                        </div>
                        <div className="flex items-center mt-2">
                            <FiCalendar className="h-5 w-5 text-yellow-400 mr-2" />
                            <p>Ngày tham gia: {formatDate(sellerInfo.createdAt)}</p>
                        </div>
                    </div>
                </div>
                
            </div>
                <div className="w-[75%] p-4">
                    <div className="flex items-center">
                        <FiPackage className="h-6 w-6 text-yellow-400" />
                        <p className='text-lg font-bold text-gray-800 ml-1'>Các sản phẩm đang bán</p>
                    </div>
                    <div className="w-full h-auto flex flex-col justify-center items-center bg-main overflow-x-hidden">
                        <div className="mt-2 mb-2 bg-white justify-center items-center">
                            <div className="flex flex-wrap justify-start items-center">
                                {Array.isArray(products) && products.map((product) => (
                                    <ProductCard1
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerPage;