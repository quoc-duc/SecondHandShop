import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserById } from '../../hooks/Users';
import { createNotification } from '../../hooks/Notifications';
import { createPayment } from '../../hooks/Payment'; 
import io from 'socket.io-client';
import { IP } from '../../config';
import { FiCheckCircle } from 'react-icons/fi';

const socket = io(`http://localhost:5555`);

const PaymentInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const cartItems = location.state?.cartItems || [];
    const orderIds = JSON.parse(sessionStorage.getItem("orderIds")) || [];

    // Trạng thái thanh toán cho mỗi sản phẩm
    const [paymentStatus, setPaymentStatus] = useState(Array(cartItems.length).fill(false));

    const handlePayConfirm = async (orderId, name, phone, buyer, seller, total_amount, index) => {
        if (!orderId) {
            console.error("Order ID không hợp lệ");
            return;
        }

        await createNotification({
            user_id_created: buyer,
            user_id_receive: seller,
            message: `Có đơn hàng của ${name} với số điện thoại là ${phone} đã thanh toán số tiền ${total_amount} cho bạn.`
        });
        socket.emit('sendNotification');

        await createPayment({
            type: "Pay Online",
            order_id: orderId,
            user_id_pay: buyer,
            user_id_receive: seller,
            total_price: total_amount,
            status_payment: 'Đã thanh toán'
        });

        // Cập nhật trạng thái thanh toán
        const updatedPaymentStatus = [...paymentStatus];
        updatedPaymentStatus[index] = true; // Đánh dấu là đã thanh toán
        setPaymentStatus(updatedPaymentStatus);
    };

    return (
        <div className="p-5 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Thông Tin Thanh Toán</h1>
            {cartItems.map((item, index) => {
                const seller = useUserById(item.user_seller); // Lấy seller tương ứng với sản phẩm
                const hasQrCode = seller && seller.qrPayment; // Kiểm tra mã QR

                return (
                    <div key={item._id} className="border rounded shadow-md p-5 w-full max-w-2xl mb-4 flex">
                        {seller && (
                            <>
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold mb-2">Tên Chủ Tài Khoản:</h2>
                                    <p className="text-lg">{seller.name}</p>

                                    <h2 className="text-xl font-semibold mb-2">Số điện thoại:</h2>
                                    <p className="text-lg">{seller.phone}</p>

                                    <h2 className="text-xl font-semibold mb-2">Sản phẩm:</h2>
                                    <p className="text-lg">{item.product_name + ". Số lượng: " }x{item.product_quantity} </p>

                                    <h2 className="text-xl font-semibold mb-2 mt-4">Số Tiền Cần Thanh Toán:</h2>
                                    <div className="text-lg text-red-600 font-bold flex items-center">
                                       
                                        {(item.product_quantity * item.product_price).toLocaleString()} VNĐ
                                    </div>

                                    {hasQrCode ? (
                                        <>
                                            {!paymentStatus[index] ? ( 
                                                <button 
                                                    onClick={() => handlePayConfirm(orderIds[index]?.id, orderIds[index]?.name_buyer, orderIds[index]?.phone, item.user_buyer, item.user_seller, (item.product_quantity * item.product_price), index)} 
                                                    className={`mt-6 text-red-600 flex items-center font-bold py-2 px-4 rounded-lg shadow transition duration-200 bg-gray-100 hover:bg-gray-300`}
                                                >
                                                     <FiCheckCircle className="h-5 w-5 mr-2" />
                                                    Xác nhận đã thanh toán
                                                </button>
                                            ) : (
                                                <p className="text-green-600 font-bold mt-6">Đã thanh toán</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-red-600 font-bold mt-6">Bạn cần thanh toán khi nhận hàng cho đơn hàng này.</p>
                                    )}
                                </div>
                                <div className="ml-4 flex-none">
                                    {hasQrCode && (
                                        <>
                                            <h2 className="text-xl font-semibold mb-2">Mã QR:</h2>
                                            <img 
                                                src={seller.qrPayment} 
                                                alt="Mã QR" 
                                                className="w-60 h-auto border rounded" 
                                            />
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
            <div className="flex space-x-4">
                <button 
                    onClick={() => navigate('/')} 
                    className="bg-gray-100 text-xl text-green-600 font-bold py-2 px-4 rounded-lg shadow hover:bg-gray-300 transition duration-200"
                >
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default PaymentInfo;