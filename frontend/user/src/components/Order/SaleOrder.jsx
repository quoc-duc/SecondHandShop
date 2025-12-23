import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import BackButton from '../../commons/BackButton';
import { IP } from '../../config';
import { FiSearch, FiX } from 'react-icons/fi';

const SaleOrder = () => {
    const [sellOrders, setSellOrders] = useState([]);
    const [activeSellTab, setActiveSellTab] = useState('All');
    const [sortOrder, setSortOrder] = useState('none');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPhone, setSearchPhone] = useState('');

    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const limit = 10; // Set limit per page

    const statusMap = {
        All: 'Tất cả',
        Pending: 'Đang chờ',
        Confirmed: 'Đã xác nhận',
        Packaged: 'Đóng gói',
        Shipping: 'Đang giao',
        Success: 'Thành công',
        Received: 'Đã nhận hàng',
        'Request Cancel': 'Yêu cầu hủy',
        Cancelled: 'Đã hủy',
    };

    useEffect(() => {
        fetchSaleOrders();
    }, [currentPage]);

    const fetchSaleOrders = async () => {
        if (isLoading) return; // Prevent loading if already loading
        setIsLoading(true);

        try {
            const buyResponse = await axios.get(`http://${IP}:5555/orders/seller1/page?page=${currentPage}&limit=${limit}&userId=${userInfo._id}`);
            
            if (buyResponse.status === 200) {
                const purchaseOrders = buyResponse.data.data;

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

                setSellOrders(ordersWithDetails);
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

    const filteredSellOrders = sellOrders.filter(order => {
        const matchesStatus = activeSellTab === 'All' || order.status_order === activeSellTab; // Include all orders if 'All' is selected
        const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPhone = order.phone.includes(searchPhone); // Filter by phone number
        return matchesStatus && matchesSearch && matchesPhone;
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

    const filterByDateRange = (orders) => {
        return orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return (!startDate || orderDate >= start) && (!endDate || orderDate <= end);
        });
    };

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

    const filteredAndSortedSellOrders = sortOrders(filterByDateRange(filteredSellOrders));

    const handleResetFilters = () => {
        setStartDate('');
        setEndDate('');
        setSortOrder('none');
        setSearchTerm('');
        setActiveSellTab('All'); // Reset to 'All'
        setSearchPhone(''); // Reset phone search
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {/* <div className="text-xl font-bold">Tìm kiếm đơn hàng</div> */}
            <div className="mb-2 mt-2 bg-white ">
                <div className="text-xl font-bold flex items-center mb-2 ml-4 mt-4">
                    <FiSearch className="mr-2 text-yellow-400 mt-4" />
                    <span className="mt-4">Tìm kiếm đơn hàng</span>
                </div>
                <div className="flex items-center mb-4 space-x-2 ml-4">
                    <div className="text-xl mb-3 font-semibold">Từ ngày:</div>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md mb-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <div className="text-xl mb-3 font-semibold">đến ngày:</div>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-md mb-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="text"
                        placeholder="Tìm theo tên người mua"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 p-2 mb-3 rounded mr-2"
                    />
                    <input
                        type="text"
                        placeholder="Tìm theo số điện thoại"
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        className="border border-gray-300 mb-3 p-2 rounded mr-2"
                    />
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border border-gray-300 mb-3 p-2 rounded"
                    >
                        <option value="none">Không sắp xếp</option>
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                    </select>
                    {/* <button 
                        onClick={handleResetFilters}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        Hủy Lọc
                    </button> */}
                    <button 
                        onClick={handleResetFilters}
                        className="bg-red-500 mb-3 text-white font-bold py-2 px-4 rounded ml-2 flex items-center hover:bg-red-400"
                    >
                        <FiX className="mr-2" />
                        Hủy Lọc
                    </button>
                </div>
            </div>
            {/* <div className="flex mb-4 w-full">
                {['All', 'Pending', 'Confirmed', 'Packaged', 'Shipping', 'Success', 'Request Cancel', 'Cancelled'].map(status => (
                    <button
                        key={status}
                        className={`flex-1 px-4 py-2 text-black rounded-md ${activeSellTab === status ? 'text-blue-500 font-bold underline bg-blue-100' : 'bg-white text-black'}`}
                        onClick={() => setActiveSellTab(status)}
                    >
                        {status}
                    </button>
                ))}
            </div> */}
            <div className="flex mb-4 w-full">
                {Object.keys(statusMap).map(status => (
                    <button
                        key={status}
                        className={`flex-1 px-4 py-2 text-black hover:underline ${activeSellTab === status ? 'text-black font-bold underline bg-yellow-400' : 'bg-white text-black'}`}
                        onClick={() => setActiveSellTab(status)}
                    >
                        {statusMap[status]}
                    </button>
                ))}
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader">Loading...</div> {/* You can replace this with a spinner component */}
                </div>
            ) : filteredAndSortedSellOrders.length === 0 ? (
                <p>Không có đơn bán nào cho trạng thái này.</p>
            ) : (
                <ul className="bg-white h-[70vh] overflow-y-auto">
                    {filteredAndSortedSellOrders.map((order, index) => (
                        <Link to={`/salesOder/${order._id}`} key={order._id}>
                            <li className="flex border-b p-4 hover:bg-gray-100 transition duration-200 border-l-4 border-r-4 hover:border-l-yellow-400 hover:border-r-yellow-400">
                                {/* <div className="text-gray-700">
                                    <span className="font-normal"> <strong>{index + 1 + (currentPage - 1) * limit}</strong> - </span>
                                </div> */}
                                <div className="text-gray-700 flex justify-center items-center w-5">
                                    <span className="font-normal"> <strong>{index + 1 + (currentPage - 1) * limit}</strong></span>
                                </div>
                                {/* <img 
                                    src={order.product.image_url} 
                                    alt={order.product.name} 
                                    className="w-16 h-16 object-cover rounded mr-4" 
                                /> */}
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
                                        Họ tên: <span className="font-normal">{order.name}</span>
                                    </div>
                                    <div className="text-gray-700">
                                        Tổng giá: <span className="font-normal">{order.total_amount.toLocaleString()} VNĐ</span>
                                    </div>
                                    <div className="text-gray-700">
                                        Ngày tạo đơn hàng: <span className="font-normal">{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="text-gray-700">
                                       Số điện thoại người mua: <span className="font-normal">{order.phone}</span>
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
    )
}

export default SaleOrder;