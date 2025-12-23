import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../../commons/BackButton';
import { getProductById } from '../../hooks/Products';
import { updateStatusOrder } from '../../hooks/Orders';
import { createNotification } from '../../hooks/Notifications';
import io from 'socket.io-client';
import { IP } from '../../config';
import { FiInfo, FiPackage,FiCheck , FiXCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const socket = io(`http://localhost:5555`); // Đảm bảo cổng đúng

const SalesOrderDetail = () => {
    const { orderId } = useParams();
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [product, setProduct] = useState(null);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelText, setCancelText] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const orderResponse = await axios.get(`http://${IP}:5555/orders/${orderId}`);
                setOrder(orderResponse.data.data);

                const paymentRe = await axios.get(`http://${IP}:5555/payments/order/${orderId}`);
                setPayment(paymentRe.data.data);

                const detailsResponse = await axios.get(`http://${IP}:5555/orderDetails/order/${orderId}`);
                const detailsData = detailsResponse.data.data;

                if (detailsData.length > 0) {
                    setOrderDetails(detailsData[0]);
                    const productData = await getProductById(detailsData[0].product_id);
                    setProduct(productData);
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

    const handleCancel = async (e) => {
        e.preventDefault();
        if (!cancelText) {
            alert(`Hãy nhập nguyên nhân huỷ đơn hàng!`);
            return;
        }
        const status_order = "Cancelled";
        alert(`Đơn hàng đã được chuyển sang ${status_order}.`);

        await updateStatusOrder(orderId, status_order);
        if (order.user_id_buyer) {
            const notification = await createNotification({
                user_id_created: userInfo._id,
                user_id_receive: order.user_id_buyer,
                message: `Đơn hàng ${product.name} của bạn đã bị huỷ do: ${cancelText}.`
            });
            socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
        }
        navigate(`/order/${orderId}`);
    };

    const handleChangeStatus = async (e) => {
        e.preventDefault();
        let status_order = "";

        if (order.status_order === 'Pending') {
            if (order.user_id_buyer) {
                const notification = await createNotification({
                    user_id_created: userInfo._id,
                    user_id_receive: order.user_id_buyer,
                    message: `Đơn hàng ${product.name} của bạn đã được xác nhận thành công.`
                });
                socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
            }
            status_order = 'Confirmed';
        } else if (order.status_order === 'Confirmed') {
            status_order = 'Packaged';
        } else if (order.status_order === 'Packaged') {
            status_order = 'Shipping';
        } else if (order.status_order === 'Success') {
            status_order = 'Received';
        }else if (order.status_order === 'Request Cancel') {
            if (order.user_id_buyer) {
                const notification = await createNotification({
                    user_id_created: userInfo._id,
                    user_id_receive: order.user_id_buyer,
                    message: `Đơn hàng ${product.name} của bạn đã được xác nhận huỷ thành công.`
                });
                socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
            }
            status_order = 'Cancelled';
        } else if (order.status_order === 'Shipping') {
            if (order.user_id_buyer) {
                const notification = await createNotification({
                    user_id_created: userInfo._id,
                    user_id_receive: order.user_id_buyer,
                    message: `Đơn hàng ${product.name} của bạn đã được giao thành công.`
                });
                socket.emit('sendNotification'); // Gửi thông báo qua WebSocket
            }
            status_order = 'Success';
        }

        alert(`Đơn hàng đã được chuyển sang ${status_order}.`);
        await updateStatusOrder(orderId, status_order);
        navigate(`/order/${orderId}`);
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
            </div>
            <div className="w-full flex flex-col items-center mb-10">
                {/* <h1 className="text-2xl font-bold">Thông tin đơn hàng</h1> */}
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
                        <div className="ml-4">
                            {/* <h2 className="text-xl font-semibold">Đơn bán</h2> */}
                            <h2 className="text-xl font-semibold font-bold flex items-center justify-center border-b-4 border-b-yellow-400">
                                <FiPackage className="mr-2 font-bold" />
                                Đơn bán
                            </h2>
                            <p className="text-xl text-black font-bold"><strong></strong> {product.name}</p>
                            <p>Mã đơn hàng: {order._id}</p>
                            <p>Người mua: {order.name}</p>
                            <p>Số điện thoại: {order.phone}</p>
                            <p>Địa chỉ giao hàng: {order.address}</p>
                            <p>Tổng số tiền: {order.total_amount.toLocaleString()} VNĐ</p>
                            <p>Trạng thái đơn hàng: <span className="text-black">{order.status_order}</span></p>
                            <p>Ghi chú: {order.note || "Không có"}</p>
                            <p>Ngày tạo đơn: {formatDate(order.createdAt)}</p>
                            {payment[0] ? (
                                <>
                                    <p>Trạng thái thanh toán: {payment[0].status_payment}</p>
                                    <p>Ngày thanh toán: {formatDate(payment[0].createdAt)}</p>
                                </>
                            ) : (
                                <p>Trạng thái thanh toán: Thanh toán khi nhận hàng</p>
                            )}
                        </div>
                    </div>
                    <div className="w-2/6 flex flex-col justify-center">
                        <div className="bg-white w-full h-full p-6 border-l-2 border-l-yellow-400">
                            {(order.status_order === 'Pending' || order.status_order === 'Shipping' ||
                            order.status_order === 'Packaged' || order.status_order === 'Confirmed') ? (
                                <div className="bg-white rounded-lg">
                                    {/* <h2 className="text-xl font-semibold">Cập nhật đơn hàng</h2> */}
                                    <h2 className="text-xl font-semibold flex items-center justify-center border-b-4 border-b-yellow-400">
                                        <FiCheckCircle   className="mr-2" />
                                        Cập nhật đơn hàng
                                    </h2>
                                    <div className='flex flex-col justify-center items-center'>
                                        {(order.status_order === 'Pending') ?
                                        <div className='flex-col justify-center'>
                                            <div>Đơn hàng sẽ chuyển trạng thái:</div>
                                            <div className="flex items-center justify-center">
                                                <span className='font-bold'>Chờ xác nhận</span>
                                                <FiArrowRight className="mx-2" />
                                                <span className='font-bold text-red-500'>Đã xác nhận</span>
                                            </div>
                                        </div> :
                                        (order.status_order === 'Confirmed') ?
                                        <div className='flex-col justify-center'>
                                            <div>Đơn hàng sẽ chuyển trạng thái:</div>
                                            <div className="flex items-center justify-center">
                                                <span className='font-bold'>Đã xác nhận</span>
                                                <FiArrowRight className="mx-2" />
                                                <span className='font-bold text-red-500'>Đóng gói</span>
                                            </div>
                                        </div> :
                                        (order.status_order === 'Packaged') ?
                                        <div className='flex-col justify-center'>
                                            <div>Đơn hàng sẽ chuyển trạng thái:</div>
                                            <div className="flex items-center justify-center">
                                                <span className='font-bold'>Đóng gói</span>
                                                <FiArrowRight className="mx-2" />
                                                <span className='font-bold text-red-500'>Giao hàng</span>
                                            </div>
                                        </div> :
                                        (order.status_order === 'Shipping') ?
                                        <div className='flex-col justify-center'>
                                            <div>Đơn hàng sẽ chuyển trạng thái:</div>
                                            <div className="flex items-center justify-center">
                                                <span className='font-bold'>Giao hàng</span>
                                                <FiArrowRight className="mx-2" />
                                                <span className='font-bold text-red-500'>Giao hàng thành công</span>
                                            </div>
                                        </div> : null}
                                        <button 
                                            onClick={handleChangeStatus} 
                                            className="bg-green-500 mt-3 mb-3 flex items-center justify-center text-white font-bold py-2 px-4 rounded-lg shadow hover:bg-green-300 transition duration-200"
                                        >
                                            <FiCheckCircle className="mr-2" />
                                            Xác nhận đơn hàng
                                        </button>
                                    </div>
                                    <h2 className="text-xl font-semibold flex items-center justify-center border-b-4 border-b-yellow-400">
                                        <FiXCircle className="mr-2" />
                                        Huỷ đơn hàng
                                    </h2>
                                    <div className="mb-2 w-full mt-5">
                                        <textarea 
                                            type="text" 
                                            placeholder="Nguyên nhân huỷ đơn hàng" 
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
                                </div>
                            ) : order.status_order === 'Success' ? null :
                            order.status_order === 'Request Cancel' ? (
                                <div className='flex flex-col jusstify-center'>
                                    <h2 className="text-xl font-semibold flex items-center justify-center border-b-4 border-b-yellow-400">
                                        <FiCheckCircle   className="mr-2" />
                                        Xác nhận huỷ đơn hàng
                                    </h2>
                                    <button 
                                        onClick={handleChangeStatus} 
                                        className="bg-green-400 text-white mt-4 mb-4 font-bold py-2 px-4 rounded-lg shadow hover:bg-green-500 transition duration-200 flex justify-center items-center"
                                    >
                                        <FiCheck className="mr-2" /> {/* Thêm icon vào đây */}
                                        Xác nhận huỷ
                                    </button>
                                    <div class="text-justify">Khi bạn xác nhận huỷ thì đơn hàng sẽ chuyển qua trạng thái đã huỷ và số lượng sản phẩm trên trang bán hàng của bạn vẫn bị giảm và không thêm trở lại, thế nên bạn hãy cập nhật lại thông tin món hàng của mình để xem lại có điều gì kiến cho người mua không hài lòng không.</div>
                                </div>
                                
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesOrderDetail;