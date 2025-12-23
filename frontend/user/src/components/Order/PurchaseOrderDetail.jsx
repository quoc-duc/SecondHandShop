import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../commons/BackButton';
import { getProductById } from '../../hooks/Products';
import { addReview } from '../../hooks/Review';
import { updateStatusOrder } from '../../hooks/Orders';
import { createNotification } from '../../hooks/Notifications';
import io from 'socket.io-client';
import { IP } from '../../config';
import { FiArrowDownRight, FiArrowRight, FiCheckCircle, FiCheckSquare, FiInfo, FiPackage, FiSend, FiShoppingCart, FiStar, FiUser, FiXCircle } from 'react-icons/fi';

const socket = io(`http://localhost:5555`);

const PurchaseOrderDetail = () => {
    const { orderId } = useParams(); // Lấy mã đơn hàng từ URL
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [product, setProduct] = useState(null);
    const [seller, setSeller] = useState(null);
    const [payment, setPayment] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [cancelText, setCancelText] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(rating == 0 || !comment){
            alert("Hãy điền đủ thông tin đánh giá!")
            return
        }
        addReview({
            product_id: product._id,
            user_id: order.user_id_buyer,
            rating: rating,
            comment: comment
        })
        alert(`Bạn đã đánh giá cho sản phẩm ${product.name}.`);
        setRating(0);
        setComment('');
        navigate(`/order/${orderId}`)
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        if (!cancelText || !cancelText.trim()) {
            alert(`Hãy nhập nguyên nhân muốn huỷ đơn hàng!`);
            return;
        }
        const status_order = 'Request Cancel';
        alert(`Đơn hàng đang được chờ xác nhận huỷ.`);
        
        try {
            await updateStatusOrder(orderId, status_order);
            
            await createNotification({
                user_id_created: order.user_id_buyer,
                user_id_receive: seller._id,
                message: `Đơn hàng ${product.name} của ${userInfo.name} đã muốn huỷ do: ${cancelText}.`
            });
            socket.emit('sendNotification');
            
            navigate(`/order/${order._id}`);
        } catch (error) {
            console.error("Có lỗi xảy ra khi huỷ đơn hàng:", error);
            alert("Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    const handleChangeStatus = async (e) => {
        e.preventDefault();
        let status_order = "";

        if (order.status_order === 'Success') {
            if (order.user_id_buyer) {
                const notification = await createNotification({
                    user_id_created: order.user_id_buyer,
                    user_id_receive: order.user_id_seller,
                    message: `Đơn hàng của ${order.name} số điện thoại ${order.phone} đã xác nhận nhận hàng thành công.`
                });
                socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
            }
            status_order = 'Received';
        }

        alert(`Đơn hàng đã được xác nhận là đã nhận hàng.`);
        await updateStatusOrder(orderId, status_order);
        navigate(`/order/${orderId}`);
    };

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Lấy thông tin đơn hàng
                const orderResponse = await axios.get(`http://${IP}:5555/orders/${orderId}`);
                setOrder(orderResponse.data.data);

                const sellerResponse = await axios.get(`http://${IP}:5555/users/${orderResponse.data.data.user_id_seller}`);
                setSeller(sellerResponse.data);

                const paymentRe = await axios.get(`http://${IP}:5555/payments/order/${orderId}`);
                setPayment(paymentRe.data.data);

                // Lấy thông tin chi tiết đơn hàng
                const detailsResponse = await axios.get(`http://${IP}:5555/orderDetails/order/${orderId}`);
                const detailsData = detailsResponse.data.data;

                // Nếu có dữ liệu, lấy sản phẩm đầu tiên
                if (detailsData.length > 0) {
                    
                    setOrderDetails(detailsData[0]); // Lưu đối tượng đầu tiên
                    const idPro = detailsData[0].product_id
                    const product1 = await getProductById(idPro)
                    setProduct(product1)
                }
                
            } catch (error) {
                console.error('Error fetching order data:', error);
                setError('Không thể tải thông tin đơn hàng.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderData();
        }
    }, [orderId]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    if (loading) {
        return <p>Đang tải thông tin đơn hàng...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!order) {
        return <p>Không tìm thấy thông tin đơn hàng.</p>;
    }

    return (
        <div className="p-5 bg-gray-100">
            <div className="flex items-center mb-4">
                <BackButton />
                {/* <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1> */}
            </div>
            <div className="w-full flex flex-col items-center mb-10">
                {/* <h1 className="text-2xl font-bold mb-4">Thông tin đơn hàng</h1> */}
                <h1 className="text-2xl font-bold mb-4 flex items-center bg-yellow-400 rounded-full">
                    <FiPackage className="ml-3"/>
                    <span className='m-3'>Thông tin đơn hàng</span>
                </h1>
                <div className="flex bg-white rounded-lg shadow-md w-4/5">
                    <div className="bg-white h-full w-4/6 flex rounded-lg p-6">
                        <div className="bg-white w-2/5 rounded-lg p-6 flex flex-col items-center justify-center">
                            {/* <img src={product.image_url} alt={product.name} className="w-full h-auto rounded-md mb-4" /> */}
                            {product.video_url?.toLowerCase().endsWith('.mp4') ? (
                                <video controls className="w-full h-auto rounded-md mb-4">
                                    <source src={product.video_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={product.image_url} className="w-full h-auto rounded-md mb-4"/>
                            )}
                            <p><strong></strong>Số lượng:{" " + orderDetails.quantity}</p>
                        </div>
                        <div className=" m-4 border-b-2 border-b-yellow-400 ">
                            {/* <h2 className="text-xl font-semibold">Đơn mua</h2> */}
                            <h2 className="text-xl font-semibold font-bold flex items-center justify-center border-b-4 border-b-yellow-400">
                                <FiShoppingCart className="mr-2 font-bold" />
                                Đơn mua
                            </h2>
                            <p className="text-xl text-black font-bold"><strong></strong> {product.name}</p>
                            <p>Mã đơn hàng:{order._id}</p>
                            <p>Địa chỉ giao hàng: {order.address}</p>
                            <p>Tổng số tiền: {order.total_amount.toLocaleString()} VNĐ</p>
                            <p>Trạng thái đơn hàng: {order.status_order}</p>
                            <p>Ghi chú: {order.note ? order.note : "Không có"}</p>
                            <p>Ngày tạo đơn: {formatDate(order.createdAt)}</p>
                            {payment[0] ? 
                            <>
                            <p>Trạng thái thanh toán: {payment[0].status_payment}</p>
                            <p>Ngày thanh toán: {formatDate(payment[0].createdAt)}</p>
                            </> :
                            <p>Trạng thái thanh toán: Thanh toán khi nhận hàng</p>
                            }
                            <div className="mt-3 ">
                                {/* <h3 className="text-xl font-semibold mt-4">Thông tin người bán</h3> //border-r-2 border-r-yellow-400 border-l-2 border-l-yellow-400 */}
                                <h3 className="text-xl font-semibold mt-4 flex items-center justify-center border-b-4 border-b-yellow-400">
                                    <FiUser className="mr-2" />
                                    Thông tin người bán
                                </h3>
                                <p>Tên người bán: {seller.name}</p>
                                <p>Số điện thoại: {seller.phone}</p>
                                <p>Địa chỉ: {seller.address}</p>
                                {/* <button 
                                    className="bg-gray-100 mt-2 border border-blue-500 text-blue-600 underline rounded p-2 hover:bg-gray-300 transition duration-300"
                                    onClick={() => navigate(`/seller/${product.user_id}`)}
                                >
                                    Xem trang người bán
                                </button> */}
                                <button
                                    className="bg-white flex items-center hover:underline text-blue-600 rounded transition duration-300 w-full md:w-auto mt-4 md:mt-0 m-3"
                                    onClick={() => navigate(`/seller/${product.user_id}`)}
                                    >
                                    <FiUser className="h-5 w-5 mr-2" />
                                    Xem trang người bán
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="w-2/6 flex flex-col justify-center">
                        <div className="bg-white w-full h-full p-6  border-l-2 border-l-yellow-400 mt-4">
                        {order && (order.status_order == 'Pending' || order.status_order == 'Confirmed') ?
                            (<div>
                                <h2 className="text-xl font-semibold flex items-center justify-center bg-yellow-400">
                                    <FiXCircle className="mr-2" />
                                    Huỷ đơn hàng
                                </h2>
                                <div className="mb-2 w-full mt-5">
                                        <textarea 
                                            type="text" 
                                            placeholder="Nguyên nhân muốn huỷ đơn hàng" 
                                            value={cancelText} 
                                            onChange={(e) => setCancelText(e.target.value)} 
                                            className="border border-gray-300 p-2 w-full rounded"
                                            rows="3"
                                            required
                                        />
                                    </div>                      
                                    <div className='flex justify-end'>
                                        <button 
                                            onClick={handleCancel} 
                                            className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-red-300 transition duration-200 flex items-center"
                                        >
                                            <FiXCircle className="mr-2" />
                                            Huỷ đơn hàng
                                        </button>
                                    </div>
                            </div>)
                        : (order.status_order == 'Success' || order.status_order == 'Received') ?
                            (<div>
                                {order.status_order == 'Success' ? 
                                <div>
                                    <h2 className="text-xl font-semibold flex items-center justify-center border-b-4 border-b-yellow-400">
                                        <FiCheckCircle className="mr-2" />
                                        Xác nhận đã nhận hàng
                                    </h2>
                                    <div className='flex flex-col justify-center items-center'>
                                        <div className='flex-col justify-center'>
                                            <div class="text-justify"> Hãy chắc chắn rằng món hàng của bạn nhận được đúng với mô tả và bạn hài lòng với món hàng đó. Hãy kiểm tra món hàng thật kỹ trước khi xác nhận. Hãy xác nhận đã nhận hàng nếu bạn không có bất kì ý kiến phản hồi về chất lượng sản phẩm bạn nhận được.</div>
                                            <div className="flex items-center justify-center">
                                                <span className='font-bold'>Thành công</span>
                                                <FiArrowRight className="mx-2" />
                                                <span className='font-bold text-red-500'>Đã nhận hàng</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleChangeStatus} 
                                            className="bg-green-500 mt-3 mb-3 flex items-center justify-center text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-300 transition duration-200"
                                        >
                                            <FiCheckCircle className="mr-2" />
                                            Xác nhận đã nhận hàng
                                        </button>
                                    </div>
                                </div>
                                : null}
                                {/* <h2 className="text-xl font-semibold">Đánh giá sản phẩm</h2> */}
                                <h2 className="text-xl font-semibold flex items-center justify-center border-b-4 border-b-yellow-400">
                                    <FiStar className="mr-2" />
                                    Đánh giá sản phẩm
                                </h2>
                            <form onSubmit={handleSubmit} className="py-4">
                                <div className="mb-2">
                                    {/* <label className="block mb-1">Đánh giá:</label> */}
                                    <div className="flex justify-between">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`cursor-pointer text-5xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                onClick={() => setRating(star)}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1" htmlFor="comment">Nhận xét:</label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="border rounded p-2 w-full"
                                        rows="4"
                                    />
                                </div>
                                {/* <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
                                    Gửi đánh giá
                                </button> */}
                                
                                {/* <button type="submit" className="bg-blue-500 text-white hover:bg-blue-400 rounded px-4 py-2 flex items-center">
                                    <FiSend className="mr-2" />
                                    Gửi đánh giá
                                </button> */}
                                <div className='flex justify-end'>
                                    <button type="submit" className="bg-blue-500 text-white hover:bg-blue-400 rounded px-4 py-2 flex items-center">
                                        <FiSend className="mr-2" />
                                        Gửi đánh giá
                                    </button>
                                </div>
                            </form>
                            </div>) : null
                        }
                            
                        </div>
                    </div>
            </div>
            </div>
        </div>
    );
};

export default PurchaseOrderDetail;