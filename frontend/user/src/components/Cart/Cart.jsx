import React, { useState, useEffect, useRef } from 'react';
import { getCartItemsByUserId, removeFromCart} from '../../hooks/Carts';
import {useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import BackButton from '../../commons/BackButton';
import io from 'socket.io-client';
import { IP } from '../../config';
import { FiShoppingCart } from 'react-icons/fi';

const socket = io(`http://localhost:5555`);

const Cart = () => {
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    const videoRef = useRef(null);

    useEffect(() => {
        const fetchCartItems = async () => {
            if (userInfo) {
                const items = await getCartItemsByUserId(userInfo._id);
                setCartItems(items);
            }
        };
        fetchCartItems();
    }, [userInfo]);

    const handleCheckboxChange = (id) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleRemoveFromCart = (id) => {
        removeFromCart(id);
        socket.emit('addCart');
    };

    const totalAmount = cartItems
        .map(item => item.product_quantity * item.product_price)
        .reduce((acc, price) => acc + price, 0);

    // Kiểm tra xem userInfo có tồn tại không
    if (!userInfo) {
        return <div className="flex justify-center items-center p-5"><p><strong>Bạn chưa đăng nhập.</strong></p></div>;
    }

    return (
        <div className="p-5">
            <div className="flex items-center mb-4">
                <BackButton />
                {/* <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1> */}
            </div>
        <div className="p-5 border rounded shadow-md">
            {/* <h2 className="text-xl font-bold mb-4">Giỏ Hàng</h2> */}
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <FiShoppingCart className="mr-2" /> {/* Icon giỏ hàng */}
                Giỏ Hàng
            </h2>
            {cartItems && cartItems.length > 0 ? (
                <ul className="divide-y divide-gray-300">
                    {cartItems.map(item => (
                        <li key={item._id} className="flex items-center justify-between py-2 ">
                            <div className="flex items-center" onClick={()=>navigate(`/product/${item.product_id}`)}>
                                {/* <input 
                                    type="checkbox" 
                                    checked={item.selected} 
                                    onChange={() => handleCheckboxChange(item.id)} 
                                    className="mr-4"
                                /> */}
                                {item.product_imageUrl?.toLowerCase().endsWith('.mp4') || item.product_imageUrl?.toLowerCase().endsWith('.mov') || item.product_imageUrl?.toLowerCase().endsWith('.webm') ? (
                                    <video className="w-16 h-16 object-cover rounded mr-4">
                                        <source src={item.product_imageUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img src={item.product_imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
                                )}
                                <div>
                                    <h3 className="font-semibold">{item.product_name}</h3>
                                    <p className="text-gray-500">Đơn giá: {item.product_price.toLocaleString()} VNĐ</p>
                                    <p className="text-gray-500">Số lượng: {item.product_quantity}</p>
                                </div>
                            </div>
                            <span className="font-bold">{(item.product_price * item.product_quantity).toLocaleString() + ' VNĐ'}</span>
                            <button 
                                onClick={() => handleRemoveFromCart(item._id)} 
                                className="text-red-500 hover:text-red-700"
                                title="Xóa khỏi giỏ hàng"
                            >
                                <FaTrash />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Giỏ hàng trống.</p>
            )}
            <hr className="my-4" />
            <div className="flex justify-between font-bold">
                <span>Tổng Giá:</span>
                <span>{totalAmount.toLocaleString()} VNĐ</span>
            </div>
            <div className='flex justify-end'>
                {/* <button className="mt-5 bg-blue-500 text-white rounded p-2 hover:bg-green-500" onClick={() => navigate('/checkout', { state: { cartItems: cartItems } })}>
                    Tiến Hành Thanh Toán
                </button> */}
                <button className="mt-5 bg-red-500 text-white font-bold rounded p-2 hover:bg-red-600 flex items-center" onClick={() => navigate('/checkout', { state: { cartItems: cartItems } })}>
                    <FiShoppingCart className="mr-2" /> {/* Icon giỏ hàng */}
                    Tiến Hành Thanh Toán
                </button>
            </div>
        </div>
        </div>
    );
};

export default Cart;