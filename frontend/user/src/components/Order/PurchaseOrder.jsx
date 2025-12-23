import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IP } from '../../config';
import { FiX } from 'react-icons/fi';

const PurchaseOrder = () => {
    const [buyOrders, setBuyOrders] = useState([]);
    const [activeBuyStatus, setActiveBuyStatus] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState('none');
    const limit = 10; // Set limit per page

    const statusMap = {
        All: 'Tất cả',
        Pending: 'Đang chờ',
        Confirmed: 'Đã xác nhận',
        Packaged: 'Đã đóng gói',
        Shipping: 'Đang giao',
        Success: 'Thành công',
        Received: 'Đã nhận hàng',
        'Request Cancel': 'Yêu cầu hủy',
        Cancelled: 'Đã hủy',
    };

    useEffect(() => {
        fetchPurchaseOrders();
    }, [currentPage]);

    const fetchPurchaseOrders = async () => {
        if (isLoading) return; // Prevent loading if already loading
        setIsLoading(true);

        try {
            const userInfoString = sessionStorage.getItem('userInfo');
            const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

            // Fetch purchase orders
            const buyResponse = await axios.get(`http://${IP}:5555/orders/buyer1/page?page=${currentPage}&limit=${limit}&userId=${userInfo._id}`);
            
            if (buyResponse.status === 200) {
                const purchaseOrders = buyResponse.data.data;

                // Process each purchase order
                const ordersWithDetails = await Promise.all(purchaseOrders.map(async (order) => {
                    const orderDetailResponse = await axios.get(`http://${IP}:5555/orderDetails/order/${order._id}`);
                    
                    if (orderDetailResponse.status === 200) {
                        const orderDetail = orderDetailResponse.data.data?.[0] || null;

                        if (orderDetail) {
                            const productResponse = await axios.get(`http://${IP}:5555/products/${orderDetail.product_id}`);
                            
                            if (productResponse.status === 200) {
                                return {
                                    ...order,
                                    orderDetail: orderDetail,
                                    product: productResponse.data,
                                };
                            }
                        }
                    }
                    return order; // Return the order as is if there's an issue
                }));

                setBuyOrders(ordersWithDetails);
                setTotalPages(buyResponse.data.totalPages); // Set total pages from response
            } else {
                alert('Không thể tải được danh sách sản phẩm!');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Không thể tải được danh sách sản phẩm!');
        } finally {
            setIsLoading(false); // End loading state
        }
    };

    const filteredBuyOrders = buyOrders.filter(order => {
        const matchesSearch = activeBuyStatus === 'All' || order.status_order === activeBuyStatus;
        const matchesSearchTerm = order.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && matchesSearchTerm;
    });

    const sortOrders = (orders) => {
        if(sortOrder == 'newest'){
            return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }else if(sortOrder == 'oldest'){
            return orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }else{
            return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
    };

    const filteredAndSortedBuyOrders = sortOrders(filteredBuyOrders);

    const handleResetFilters = () => {
        setStartDate('');
        setEndDate('');
        setSearchTerm('');
        setSortOrder('none');
        setActiveBuyStatus('All');
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="text-xl font-bold">Tìm kiếm đơn hàng</div>
            <div className="flex mb-4">
                <select 
                    value={activeBuyStatus}
                    onChange={(e) => setActiveBuyStatus(e.target.value)}
                    className="border border-gray-300 p-2 rounded mr-2"
                >
                    <option value="All">Tất cả trạng thái</option>
                    <option value="Pending">Chờ xử lý</option>
                    <option value="Confirmed">Đã xác nhận</option>
                    <option value="Packaged">Đang đóng gói</option>
                    <option value="Shipping">Đang vận chuyển</option>
                    <option value="Success">Thành công</option>
                    <option value="Received">Đã nhận hàng</option>
                    <option value="Request Cancel">Yêu cầu hủy</option>
                    <option value="Cancelled">Đã hủy</option>
                </select>
                <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border border-gray-300 p-2 rounded"
                    >
                        <option value="none">Không sắp xếp</option>
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                <button 
                    onClick={handleResetFilters}
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-2 flex items-center hover:bg-red-400"
                >
                    <FiX className="mr-2" />
                    Hủy Lọc
                </button>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader">Loading...</div> {/* You can replace this with a spinner component */}
                </div>
            ) : filteredAndSortedBuyOrders.length === 0 ? (
                <p>Không có đơn mua nào.</p>
            ) : (
                <ul className="bg-white h-[70vh] overflow-y-auto">
                    {filteredAndSortedBuyOrders.map((order, index) => (
                        <Link to={`/purchaseOrder/${order._id}`} key={order._id}>
                            <li className="flex border-b p-4 hover:bg-gray-100 transition duration-200 border-l-4 border-r-4 hover:border-l-yellow-400 hover:border-r-yellow-400">
                                {/* <div className="text-gray-700">
                                    <span className="font-normal"> <strong>{index + 1 + (currentPage - 1) * limit}</strong> - </span>
                                </div> */}
                                <div className="text-gray-700 flex justify-center items-center w-5">
                                    <span className="font-normal"> <strong>{index + 1 + (currentPage - 1) * limit}</strong></span>
                                </div>
                                {/* {order.product.image_url ? 
                                <img 
                                    src={order.product.image_url} 
                                    alt={order.product.name} 
                                    className="w-16 h-16 object-cover rounded mr-4" 
                                />: null} */}
                                {/* {order.product.video_url?.toLowerCase().endsWith('.mp4') ? (
                                    <video controls className="w-16 h-16 object-cover rounded mr-4">
                                        <source src={order.product.video_url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img src={order.product.image_url} className="w-16 h-16 object-cover rounded mr-4"/>
                                )} */}
                                <div className="text-gray-700 flex justify-center items-center">
                                    {order.product.video_url?.toLowerCase().endsWith('.mp4') ? (
                                        <video controls className="w-24 h-24 object-cover rounded ml-3 mr-3">
                                            <source src={order.product.video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img src={order.product.image_url} className="w-24 h-24 object-cover rounded ml-3 mr-3"/>
                                    )}
                                </div>
                                <div className="text-gray-700 flex-col justify-center items-center">
                                    <div className="text-gray-700">
                                        <span className="font-normal"><strong>{order.product.name}</strong></span>
                                    </div>
                                    <div className="text-gray-700">
                                        Tổng giá: <span className="font-normal">{order.total_amount.toLocaleString()} VNĐ - </span>
                                    </div>
                                    <div className="text-gray-700">
                                        Ngày mua hàng: <span className="font-normal">{new Date(order.createdAt).toLocaleDateString()} - </span>
                                    </div>
                                    <div className="text-gray-700">
                                        Trạng thái đơn hàng: 
                                        <span className="font-normal text-red-500">{" " + statusMap[order.status_order]}</span>
                                    </div>
                                </div>
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        className={`mx-1 py-2 px-4 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PurchaseOrder;