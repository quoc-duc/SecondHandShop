// import { useState } from "react";
// import { useOrders } from "../../hooks/useOrder";
// import { TbListDetails } from "react-icons/tb";
// import { FaSort } from "react-icons/fa";
// import { FaSearch } from "react-icons/fa";
// import { MdOutlineFilterAlt } from "react-icons/md";

// const OrderList = () => {
//   const [page, setPage] = useState(1);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [fieldSort, setFieldSort] = useState("");
//   const [orderSort, setOrderSort] = useState("asc");
//   const [searchKey, setSearchKey] = useState("");
//   const [statusOrder, setStatusOrder] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [showFilterMenu, setShowFilterMenu] = useState(null);

//   const {
//     orders = [],
//     loading,
//     error,
//     totalPages,
//   } = useOrders(
//     page,
//     fieldSort,
//     orderSort,
//     searchKey,
//     statusOrder,
//     paymentMethod,
//     paymentStatus
//   );

//   const statusOrderMap = {
//     "Request Cancel": "Yêu cầu hủy",
//     Cancelled: "Đã hủy",
//     Pending: "Chờ xác nhận",
//     Confirmed: "Đã xác nhận",
//     Packaged: "Đã đóng gói",
//     Shipping: "Đang giao hàng",
//     Success: "Giao hàng thành công",
//     Received: "Đã nhận hàng",
//   };

//   const paymentMethodMap = {
//     cash: "Tiền mặt",
//     onlinepay: "Thanh toán trực tuyến",
//   };

//   const paymentStatusMap = {
//     awaiting_payment: "Chưa thanh toán",
//     paid: "Đã thanh toán",
//     released_to_seller: "Đã hoàn tiền người bán",
//   };

//   const toggleFilterMenu = (filterType) => {
//     setShowFilterMenu((prev) => (prev === filterType ? null : filterType));
//   };

//   const handleSort = (field) => {
//     setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
//     setFieldSort(field);
//   };

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//     setIsPopupOpen(true);
//   };
//   const closePopup = () => {
//     setIsPopupOpen(false);
//     setSelectedOrder(null);
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg">
//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="flex items-center">
//         {/* <select
//           className="text-sm border border-black p-2 mb-4"
//           defaultValue="choose"
//         >
//           <option value="choose" disabled>
//             Choose action...
//           </option>
//           <option value="deleteRolePartners">
//             Delete selected role partners
//           </option>
//         </select> */}
//         <div className="w-full flex border-2 border-gray-200 mb-4 p-1">
//           <div className="flex w-full mx-10 rounded bg-white">
//             <input
//               className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none "
//               type="search"
//               name="search"
//               placeholder="Tìm kiếm theo tên người mua..."
//               value={searchKey}
//               onChange={(e) => setSearchKey(e.target.value)}
//             />
//             <button type="submit" className="m-2 rounded text-blue-600">
//               <FaSearch />
//             </button>
//           </div>
//         </div>
//         <button
//           className="mb-4 text-sm border-2 rounded"
//           onClick={() => {
//             setStatusOrder("");
//             setPaymentMethod("");
//             setPaymentStatus("");
//           }}
//         >
//           Xóa lọc
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border px-4 py-2 text-center whitespace-nowrap">
//                 <span className="text-sm inline-flex items-center gap-x-2">
//                   <FaSort onClick={() => handleSort("name_buyer")} /> Người mua
//                 </span>
//               </th>
//               <th className="border px-4 py-2 text-center whitespace-nowrap">
//                 <span className="text-sm inline-flex items-center gap-x-2">
//                   <FaSort onClick={() => handleSort("product_name")} /> Sản phẩm
//                 </span>
//               </th>
//               <th className="border py-2 text-center whitespace-nowrap">
//                 <span className="text-sm inline-flex items-center gap-x-2">
//                   <FaSort onClick={() => handleSort("quantity")} /> Số lượng
//                 </span>
//               </th>
//               <th className="border px-4 py-2 text-center whitespace-nowrap">
//                 <span className="text-sm inline-flex items-center gap-x-2">
//                   <FaSort onClick={() => handleSort("price")} /> Tổng tiền
//                 </span>
//               </th>
//               <th className="border px-4 py-2 text-center whitespace-nowrap">
//                 <span className="text-sm inline-flex items-center gap-x-2">
//                   <FaSort onClick={() => handleSort("address_buyer")} /> Địa chỉ
//                 </span>
//               </th>
//               <th className="border px-2 py-2 whitespace-nowrap text-left">
//                 <span className="text-sm inline-flex gap-x-2 items-center">
//                   <span className="relative inline-block">
//                     <MdOutlineFilterAlt
//                       className="cursor-pointer"
//                       onClick={() => toggleFilterMenu("statusOrder")}
//                     />
//                     {showFilterMenu === "statusOrder" && (
//                       <div className="absolute left-0 top-full mt-1 z-10 bg-white border rounded shadow p-2 w-max">
//                         {Object.entries(statusOrderMap).map(([key, value]) => (
//                           <div
//                             key={key}
//                             onClick={() => {
//                               setStatusOrder(key);
//                               setShowFilterMenu(null);
//                             }}
//                             className="text-sm px-2 py-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap font-normal"
//                           >
//                             {value}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </span>
//                   Trạng thái đơn hàng
//                 </span>
//               </th>

//               <th className="border px-2 py-2 whitespace-nowrap text-left">
//                 <span className="text-sm inline-flex items-center gap-x-2">
//                   <span className="relative inline-block">
//                     <MdOutlineFilterAlt
//                       className="cursor-pointer"
//                       onClick={() => toggleFilterMenu("paymentMethod")}
//                     />
//                     {showFilterMenu === "paymentMethod" && (
//                       <div className="absolute left-0 top-full mt-1 z-10 bg-white border rounded shadow p-2 w-max">
//                         {Object.entries(paymentMethodMap).map(
//                           ([key, value]) => (
//                             <div
//                               key={key}
//                               onClick={() => {
//                                 setPaymentMethod(key);
//                                 setShowFilterMenu(null);
//                               }}
//                               className="text-sm px-2 py-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap font-normal"
//                             >
//                               {value}
//                             </div>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </span>
//                   Phương thức thanh toán
//                 </span>
//               </th>

//               <th className="border px-2 py-2 whitespace-nowrap text-left">
//                 <span className="text-sm inline-flex items-center gap-x-2">
//                   <span className="relative inline-block">
//                     <MdOutlineFilterAlt
//                       onClick={() => toggleFilterMenu("paymentStatus")}
//                     />
//                     {showFilterMenu === "paymentStatus" && (
//                       <div className="absolute z-10 bg-white border rounded shadow p-2">
//                         {Object.entries(paymentStatusMap).map(
//                           ([key, value]) => (
//                             <div
//                               key={key}
//                               onClick={() => {
//                                 setPaymentStatus(key);
//                                 setShowFilterMenu(null);
//                               }}
//                               className="text-sm px-2 py-1 hover:bg-gray-100 cursor-pointer font-normal"
//                             >
//                               {value}
//                             </div>
//                           )
//                         )}
//                       </div>
//                     )}
//                   </span>
//                   Trạng thái thanh toán{" "}
//                 </span>
//               </th>
//               <th className="text-sm border px-2 py-2 text-center">Chi tiết</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(orders) && orders.length > 0 ? (
//               orders.map((order) => (
//                 <tr key={order._id} className="border">
//                   <td className="border px-4 py-2 text-sm ">
//                     {order.name_buyer}
//                   </td>
//                   <td className="border px-2 py-2 text-sm">
//                     {order.product_name}
//                   </td>
//                   <td className="border py-2 text-sm text-center">
//                     {order.quantity}
//                   </td>
//                   <td className="border px-4 py-2 text-sm ">{order.price}</td>
//                   <td className="border px-4 py-2 text-sm ">
//                     {order.address_buyer}
//                   </td>
//                   <td className="border px-2 py-2 text-sm ">
//                     {statusOrderMap[order.status_order] || order.status_order}
//                   </td>
//                   <td className="border px-2 py-2 text-sm ">
//                     {paymentMethodMap[order.payment_method] ||
//                       order.payment_method}
//                   </td>
//                   <td className="border px-2 py-2 text-sm ">
//                     {paymentStatusMap[order.payment_status] ||
//                       order.payment_status}
//                   </td>

//                   <th className="border px-4 py-2">
//                     <button
//                       onClick={() => handleViewDetails(order)}
//                       className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
//                     >
//                       <TbListDetails />
//                     </button>
//                   </th>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="3" className="p-4 text-center">
//                   Không có đơn hàng.
//                   {console.log(orders)}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-4">
//         <button
//           className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//         >
//           Trước
//         </button>
//         <span className="text-sm px-3 py-1 mx-2">
//           Trang {page} của {totalPages}
//         </span>
//         <button
//           className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
//           disabled={page >= totalPages}
//           onClick={() => setPage(page + 1)}
//         >
//           Sau
//         </button>
//       </div>

//       {isPopupOpen && selectedOrder && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-4 rounded shadow-md w-100">
//             <h2 className="text-lg font-bold mb-4">Chi tiết đơn hàng</h2>

//             <table className="table-auto w-full border-collapse border border-gray-300">
//               <tbody>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">Người mua</td>
//                   <td className="border px-4 py-2">
//                     {selectedOrder.name_buyer}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">Sản phẩm</td>
//                   <td className="border px-4 py-2">
//                     {selectedOrder.product_name}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">Số lượng</td>
//                   <td className="border px-4 py-2">{selectedOrder.quantity}</td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">Tổng tiền</td>
//                   <td className="border px-4 py-2">{selectedOrder.price}</td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">SĐT người mua</td>
//                   <td className="border px-4 py-2">
//                     {selectedOrder.phone_buyer}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">Địa chỉ</td>
//                   <td className="border px-4 py-2">
//                     {selectedOrder.address_buyer}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">
//                     Trạng thái đơn hàng
//                   </td>
//                   <td className="border px-4 py-2">
//                     {statusOrderMap[selectedOrder.status_order] ||
//                       selectedOrder.status_order}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">Loại giao hàng</td>
//                   <td className="border px-4 py-2">
//                     {selectedOrder.shipping_method}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">
//                     Chi phí giao hàng
//                   </td>
//                   <td className="border px-4 py-2">
//                     {selectedOrder.shipping_cost}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">
//                     Phương thức thanh toán
//                   </td>
//                   <td className="border px-4 py-2">
//                     {paymentMethodMap[selectedOrder.payment_method] ||
//                       selectedOrder.payment_method}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">
//                     Trạng thái thanh toán
//                   </td>
//                   <td className="border px-4 py-2">
//                     {paymentStatusMap[selectedOrder.payment_status] ||
//                       selectedOrder.payment_status}
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="border px-4 py-2 font-bold">Ghi chú</td>
//                   <td className="border px-4 py-2">{selectedOrder.note}</td>
//                 </tr>
//               </tbody>
//             </table>
//             <div className="mt-4 flex justify-end">
//               <button
//                 className="bg-gray-200 px-4 py-2 rounded"
//                 onClick={closePopup}
//               >
//                 Đóng
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderList;

import { useState, useEffect } from "react";
import { useOrders } from "../../hooks/useOrder";
import { createVNPayPayment } from "../../hooks/VNPayAdmin";
import { TbListDetails } from "react-icons/tb";
import { FaSort, FaSearch } from "react-icons/fa";
import { MdOutlineFilterAlt } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("asc");
  const [searchKey, setSearchKey] = useState("");
  const [statusOrder, setStatusOrder] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(null);
  const navigate = useNavigate();

  const {
    orders = [],
    loading,
    error,
    totalPages,
  } = useOrders(
    page,
    fieldSort,
    orderSort,
    searchKey,
    statusOrder,
    paymentMethod,
    paymentStatus
  );

  const statusOrderMap = {
    "Request Cancel": "Yêu cầu hủy",
    Cancelled: "Đã hủy",
    Pending: "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Packaged: "Đã đóng gói",
    Shipping: "Đang giao hàng",
    Success: "Giao hàng thành công",
    Received: "Đã nhận hàng",
  };

  const paymentMethodMap = {
    cash: "Tiền mặt",
    onlinepay: "Thanh toán trực tuyến",
  };

  const paymentStatusMap = {
    awaiting_payment: "Chưa thanh toán",
    paid: "Đã thanh toán",
    released_to_seller: "Đã hoàn tiền người bán",
  };

  const toggleFilterMenu = (filterType) => {
    setShowFilterMenu((prev) => (prev === filterType ? null : filterType));
  };

  const handleSort = (field) => {
    setOrderSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setFieldSort(field);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  const handlePayment = async (order) => {
    try {
      const paymentData = {
        amount: order.price,
        orderDescription: `${order._id}`,
      };
      const response = await createVNPayPayment(paymentData);
      if (response.paymentUrl) {
        // Store order ID in sessionStorage to retrieve in PaymentResult
        sessionStorage.setItem("paymentOrderId", order.order_id);
        window.location.href = response.paymentUrl; // Redirect to VNPay payment page
      }
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      alert("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex items-center">
        <div className="w-full flex border-2 border-gray-200 mb-4 p-1">
          <div className="flex w-full mx-10 rounded bg-white">
            <input
              className="text-sm w-full border-none bg-transparent px-4 py-1 text-gray-400 outline-none focus:outline-none"
              type="search"
              name="search"
              placeholder="Tìm kiếm theo tên người mua..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="submit" className="m-2 rounded text-blue-600">
              <FaSearch />
            </button>
          </div>
        </div>
        <button
          className="mb-4 text-sm border-2 rounded"
          onClick={() => {
            setStatusOrder("");
            setPaymentMethod("");
            setPaymentStatus("");
          }}
        >
          Xóa lọc
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  <FaSort onClick={() => handleSort("name_buyer")} /> Người mua
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  <FaSort onClick={() => handleSort("product_name")} /> Sản phẩm
                </span>
              </th>
              <th className="border py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  <FaSort onClick={() => handleSort("quantity")} /> Số lượng
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  <FaSort onClick={() => handleSort("price")} /> Tổng tiền
                </span>
              </th>
              <th className="border px-4 py-2 text-center whitespace-nowrap">
                <span className="text-sm inline-flex items-center gap-x-2">
                  <FaSort onClick={() => handleSort("address_buyer")} /> Địa chỉ
                </span>
              </th>
              <th className="border px-2 py-2 whitespace-nowrap text-left">
                <span className="text-sm inline-flex gap-x-2 items-center">
                  <span className="relative inline-block">
                    <MdOutlineFilterAlt
                      className="cursor-pointer"
                      onClick={() => toggleFilterMenu("statusOrder")}
                    />
                    {showFilterMenu === "statusOrder" && (
                      <div className="absolute left-0 top-full mt-1 z-10 bg-white border rounded shadow p-2 w-max">
                        {Object.entries(statusOrderMap).map(([key, value]) => (
                          <div
                            key={key}
                            onClick={() => {
                              setStatusOrder(key);
                              setShowFilterMenu(null);
                            }}
                            className="text-sm px-2 py-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap font-normal"
                          >
                            {value}
                          </div>
                        ))}
                      </div>
                    )}
                  </span>
                  Trạng thái đơn hàng
                </span>
              </th>
              <th className="border px-2 py-2 whitespace-nowrap text-left">
                <span className="text-sm inline-flex items-center gap-x-2">
                  <span className="relative inline-block">
                    <MdOutlineFilterAlt
                      className="cursor-pointer"
                      onClick={() => toggleFilterMenu("paymentMethod")}
                    />
                    {showFilterMenu === "paymentMethod" && (
                      <div className="absolute left-0 top-full mt-1 z-10 bg-white border rounded shadow p-2 w-max">
                        {Object.entries(paymentMethodMap).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              onClick={() => {
                                setPaymentMethod(key);
                                setShowFilterMenu(null);
                              }}
                              className="text-sm px-2 py-1 hover:bg-gray-100 cursor-pointer whitespace-nowrap font-normal"
                            >
                              {value}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </span>
                  Phương thức thanh toán
                </span>
              </th>
              <th className="border px-2 py-2 whitespace-nowrap text-left">
                <span className="text-sm inline-flex items-center gap-x-2">
                  <span className="relative inline-block">
                    <MdOutlineFilterAlt
                      onClick={() => toggleFilterMenu("paymentStatus")}
                    />
                    {showFilterMenu === "paymentStatus" && (
                      <div className="absolute z-10 bg-white border rounded shadow p-2">
                        {Object.entries(paymentStatusMap).map(
                          ([key, value]) => (
                            <div
                              key={key}
                              onClick={() => {
                                setPaymentStatus(key);
                                setShowFilterMenu(null);
                              }}
                              className="text-sm px-2 py-1 hover:bg-gray-100 cursor-pointer font-normal"
                            >
                              {value}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </span>
                  Trạng thái thanh toán
                </span>
              </th>
              <th className="text-sm border px-2 py-2 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border">
                  <td className="border px-4 py-2 text-sm">
                    {order.name_buyer}
                  </td>
                  <td className="border px-2 py-2 text-sm">
                    {order.product_name}
                  </td>
                  <td className="border py-2 text-sm text-center">
                    {order.quantity}
                  </td>
                  <td className="border px-4 py-2 text-sm">{order.price}</td>
                  <td className="border px-4 py-2 text-sm">
                    {order.address_buyer}
                  </td>
                  <td className="border px-2 py-2 text-sm">
                    {statusOrderMap[order.status_order] || order.status_order}
                  </td>
                  <td className="border px-2 py-2 text-sm">
                    {paymentMethodMap[order.payment_method] ||
                      order.payment_method}
                  </td>
                  <td className="border px-2 py-2 text-sm">
                    {paymentStatusMap[order.payment_status] ||
                      order.payment_status}
                  </td>
                  <th className="border px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <TbListDetails />
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center">
                  Không có đơn hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Trước
        </button>
        <span className="text-sm px-3 py-1 mx-2">
          Trang {page} của {totalPages}
        </span>
        <button
          className="text-sm px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sau
        </button>
      </div>

      {isPopupOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md w-100">
            <h2 className="text-lg font-bold mb-4">
              Chi tiết đơn hàng{selectedOrder._id}
            </h2>

            <table className="table-auto w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border px-4 py-2 font-bold">Người mua</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.name_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Sản phẩm</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.product_name}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Số lượng</td>
                  <td className="border px-4 py-2">{selectedOrder.quantity}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Tổng tiền</td>
                  <td className="border px-4 py-2">{selectedOrder.price}</td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">SĐT người mua</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.phone_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Địa chỉ</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.address_buyer}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Trạng thái đơn hàng
                  </td>
                  <td className="border px-4 py-2">
                    {statusOrderMap[selectedOrder.status_order] ||
                      selectedOrder.status_order}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Loại giao hàng</td>
                  <td className="border px-4 py-2">
                    {selectedOrder.shipping_method}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Chi phí giao hàng
                  </td>
                  <td className="border px-4 py-2">
                    {selectedOrder.shipping_cost}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Phương thức thanh toán
                  </td>
                  <td className="border px-4 py-2">
                    {paymentMethodMap[selectedOrder.payment_method] ||
                      selectedOrder.payment_method}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">
                    Trạng thái thanh toán
                  </td>
                  <td className="border px-4 py-2">
                    {paymentStatusMap[selectedOrder.payment_status] ||
                      selectedOrder.payment_status}
                  </td>
                </tr>
                <tr>
                  <td className="border px-4 py-2 font-bold">Ghi chú</td>
                  <td className="border px-4 py-2">{selectedOrder.note}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 flex justify-end space-x-2">
              {((selectedOrder.payment_status === "paid" &&
                selectedOrder.status_order === "Succress") ||
                (selectedOrder.payment_status === "paid" &&
                  selectedOrder.status_order === "Received")) && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={() => handlePayment(selectedOrder)}
                >
                  Thanh toán cho người bán
                </button>
              )}
              {selectedOrder.payment_status === "released_to_seller" && (
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                  disabled
                >
                  Đã thanh toán cho người bán
                </button>
              )}
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={closePopup}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
