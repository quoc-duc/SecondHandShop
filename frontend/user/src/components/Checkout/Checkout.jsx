import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../../commons/BackButton";
import { createOrder } from "../../hooks/Orders";
import { createOrderDetail } from "../../hooks/Orderdetails";
import { updateProduct } from "../../hooks/Products";
import { removeFromCart } from "../../hooks/Carts";
import { createNotification } from "../../hooks/Notifications";
import { useLocationAddress, useUsersByIds } from "../../hooks/Users";
import io from "socket.io-client";
import axios from "axios";
import { useMemo } from "react";
import {
  FiShoppingCart,
  FiTruck,
  FiFileText,
  FiUser,
  FiCreditCard,
  FiDollarSign,
} from "react-icons/fi";
import { createVNPayPayment } from "../../hooks/VNPay";
import { v4 as uuidv4 } from "uuid";

const socket = io(`http://localhost:5555`);

const Checkout = () => {
  const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = useMemo(() => {
    return location.state?.product
      ? [location.state.product]
      : location.state?.cartItems || [];
  }, [location.state]);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [shippingOptions, setShippingOptions] = useState([
    {
      MA_DV_CHINH: "LCOD",
      TEN_DICHVU: "TMĐT Tiết Kiệm thỏa thuận",
    },
    {
      MA_DV_CHINH: "SCN",
      TEN_DICHVU: "Chuyển phát nhanh",
    },
    {
      MA_DV_CHINH: "SHT",
      TEN_DICHVU: "Chuyển phát hỏa tốc",
    },
    {
      MA_DV_CHINH: "STK",
      TEN_DICHVU: "Chuyển phát tiết kiệm",
    },
    {
      MA_DV_CHINH: "VHT",
      TEN_DICHVU: "Hỏa tốc thỏa thuận",
    },
    {
      MA_DV_CHINH: "OTHER",
      TEN_DICHVU: "Khác (liên hệ người bán)",
    },
  ]);

  const [selectedShipping, setSelectedShipping] = useState("");
  const [shippingCosts, setShippingCosts] = useState({});

  const { provinces, districts } = useLocationAddress(provinceId);
  const sellerIds = useMemo(
    () => [...new Set(cartItems.map((item) => item.user_seller))],
    [cartItems]
  );
  const sellerInfos = useUsersByIds(sellerIds);

  const groupedItems = cartItems.reduce((acc, item) => {
    const sellerId = item.user_seller;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        items: [],
        total: 0,
      };
    }
    acc[sellerId].items.push(item);
    acc[sellerId].total += item.product_price * item.product_quantity;
    return acc;
  }, {});

  useEffect(() => {
    if (userInfo) {
      setFullName(userInfo.name || "");
      setPhoneNumber(userInfo.phone || "");
      setAddress(userInfo.address || "");
      setEmail(userInfo.email || "");
      setProvinceId(userInfo.provinceId || "");
      setDistrictId(userInfo.districtId || "");
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchShippingPrices = async () => {
      if (
        provinceId &&
        districtId &&
        sellerIds.length > 0 &&
        selectedShipping
      ) {
        const shippingCostMap = {};

        // Nếu chọn OTHER, set phí = 0 cho tất cả người bán
        if (selectedShipping === "OTHER") {
          sellerIds.forEach((sellerId) => {
            shippingCostMap[sellerId] = 0;
          });
          setShippingCosts(shippingCostMap);
          return;
        }

        for (const sellerId of sellerIds) {
          const sellerItems = groupedItems[sellerId].items;
          const sellerInfo = sellerInfos.find((info) => info._id === sellerId);
          if (!sellerInfo) continue;

          const totalWeight = sellerItems.reduce(
            (sum, item) => sum + item.product_weight * item.product_quantity,
            0
          );
          const totalPrice = sellerItems.reduce(
            (sum, item) => sum + item.product_price * item.product_quantity,
            0
          );

          try {
            const response = await axios.post(
              "http://localhost:5555/orders/getShippingPrices",
              {
                SENDER_PROVINCE: Number(sellerInfo.provinceId) || 2,
                SENDER_DISTRICT: Number(sellerInfo.districtId) || 1231,
                RECEIVER_PROVINCE: Number(provinceId),
                RECEIVER_DISTRICT: Number(districtId),
                PRODUCT_TYPE: "HH",
                PRODUCT_WEIGHT: totalWeight,
                PRODUCT_PRICE: totalPrice,
                MONEY_COLLECTION: totalPrice.toString(),
                TYPE: 1,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const option = response.data.find(
              (opt) => opt.MA_DV_CHINH === selectedShipping
            );
            shippingCostMap[sellerId] = option ? option.GIA_CUOC : 0;
          } catch (error) {
            console.error(
              `Error fetching shipping price for seller ${sellerId}:`,
              error
            );
            shippingCostMap[sellerId] = 0;
          }
        }

        setShippingCosts(shippingCostMap);
      } else {
        setShippingCosts({});
      }
    };

    fetchShippingPrices();
  }, [provinceId, districtId, selectedShipping, sellerIds, sellerInfos]);

  const handleShippingSelection = (method) => {
    setSelectedShipping(method);
  };

  const handleCheckout = async () => {
    if (!fullName || !phoneNumber || !address || !provinceId || !districtId) {
      alert(
        "Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại, Địa chỉ, Tỉnh/Thành, Quận/Huyện."
      );
      return;
    }

    if (!selectedShipping) {
      alert("Vui lòng chọn hình thức vận chuyển.");
      return;
    }

    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(phoneNumber)) {
      alert("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
      return;
    }

    let orderIds = [];
    let totalOrderAmount = 0;
    for (const sellerId of Object.keys(groupedItems)) {
      const items = groupedItems[sellerId].items;
      const totalAmount = groupedItems[sellerId].total;
      const sellerShippingCost = shippingCosts[sellerId] || 0;

      for (const item of items) {
        const quanlity = -item.product_quantity;
        const id = item.product_id;
        const quanli = await updateProduct({ id, quanlity });

        if (
          quanli.quantity < 0 ||
          quanli.status === false ||
          quanli.approve === false
        ) {
          alert(
            "Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác."
          );
          await updateProduct({ id, quanlity: item.product_quantity });
          navigate("/");
          return;
        }
        totalOrderAmount = totalAmount + sellerShippingCost;
        const order = await createOrder({
          user_id_buyer: userInfo?._id || "",
          user_id_seller: item.user_seller,
          name: fullName,
          phone: phoneNumber,
          address: address,
          total_amount: totalAmount + sellerShippingCost,
          note: note,
          provinceId: provinceId,
          districtId: districtId,
          shipping_method: selectedShipping,
          shipping_cost: sellerShippingCost,
          payment_method: paymentMethod,
        });

        orderIds.push({
          id: order.data._id,
          name_buyer: order.data.name,
          phone: order.data.phone,
        });

        await createOrderDetail({
          order_id: order.data._id,
          product_id: item.product_id,
          quantity: item.product_quantity,
          price: totalAmount + sellerShippingCost,
        });

        if (userInfo) {
          await createNotification({
            user_id_created: userInfo._id,
            user_id_receive: userInfo._id,
            message: `Bạn đã đặt thành công đơn hàng ${item.product_name}: ${order.data.total_amount} VNĐ.`,
          });
          socket.emit("sendNotification");
        }

        await createNotification({
          user_id_created: userInfo?._id || "",
          user_id_receive: item.user_seller,
          message: `Có đơn hàng ${item.product_name} của ${order.data.name} số điện thoại ${order.data.phone} đang chờ bạn xác nhận.`,
        });
        socket.emit("sendNotification");

        const idCart = item._id;
        if (!location.state?.product) {
          await removeFromCart(idCart);
        }
      }
    }

    sessionStorage.setItem("orderIds", JSON.stringify(orderIds));

    try {
      if (paymentMethod === "onlinepay") {
        try {
          const orderDescription = uuidv4();
          console.log("VNPay orderDescription:", orderDescription); // Log để kiểm tra
          const paymentResponse = await createVNPayPayment({
            amount: totalOrderAmount,
            orderDescription,
            orderType: "other",
            language: "vn",
          });

          console.log("VNPay Payment Response:", paymentResponse); // Log phản hồi
          sessionStorage.setItem("orderIds", JSON.stringify(orderIds));
          window.location.href = paymentResponse.paymentUrl;
        } catch (error) {
          console.error("Error creating VNPay payment:", error);
          alert("Lỗi khi tạo thanh toán VNPay. Vui lòng thử lại.");
        }
      } else {
        alert(
          "Đơn hàng đã được tạo thành công! Bạn sẽ thanh toán khi nhận hàng."
        );
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold ml-4">Thanh Toán</h1>
      </div>
      <div className="flex space-x-10">
        <div className="flex-1 border rounded shadow-md p-5">
          {/* <h2 className="text-xl font-bold mb-4">Thông Tin Người Nhận</h2> */}
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiUser className="h-6 w-6 mr-2" />
            Thông Tin Người Nhận
          </h2>
          <input
            type="text"
            placeholder="Họ và Tên (bắt buộc)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border rounded p-2 w-full mb-2"
            required
          />
          <input
            type="number"
            placeholder="Số Điện Thoại (bắt buộc)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="border rounded p-2 w-full mb-2"
            required
          />
          <select
            value={provinceId}
            onChange={(e) => {
              setProvinceId(e.target.value);
              setDistrictId(""); // Reset district when province changes
              setShippingCosts({}); // Reset shipping costs
              // Only reset selectedShipping if shipping options are invalid
            }}
            className={`border rounded p-2 w-full mb-2 ${
              !provinceId ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="">Chọn tỉnh/thành</option>
            {provinces.map((province) => (
              <option key={province.PROVINCE_ID} value={province.PROVINCE_ID}>
                {province.PROVINCE_NAME}
              </option>
            ))}
          </select>
          <select
            value={districtId}
            onChange={(e) => {
              setDistrictId(e.target.value);
              setShippingCosts({}); // Reset shipping costs
              // Only reset selectedShipping if shipping options are invalid
            }}
            className={`border rounded p-2 w-full mb-2 ${
              !districtId ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.DISTRICT_ID} value={district.DISTRICT_ID}>
                {district.DISTRICT_NAME}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Địa chỉ chi tiết (bắt buộc)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border rounded p-2 w-full mb-2"
            required
          />
          <input
            type="email"
            placeholder="Email (nếu có)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          />
          <textarea
            placeholder="Ghi chú (nếu có)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border rounded p-2 w-full mb-2"
            rows="4"
          />
          {/* <h3 className="text-lg font-semibold mt-4">Hình Thức Vận Chuyển</h3> */}
          <h3 className="text-lg font-semibold mt-4 flex items-center">
            <FiTruck className="h-5 w-5 mr-2" />
            Hình Thức Vận Chuyển
          </h3>
          <select
            value={selectedShipping}
            onChange={(e) => handleShippingSelection(e.target.value)}
            className="border rounded p-2 w-full mb-2"
          >
            <option value="">Chọn phương thức vận chuyển</option>
            {shippingOptions.map((option) => (
              <option key={option.MA_DV_CHINH} value={option.MA_DV_CHINH}>
                {option.TEN_DICHVU}
              </option>
            ))}
          </select>
          {/* <h3 className="text-lg font-semibold mt-4">Phương Thức Thanh Toán</h3> */}
          <h3 className="text-lg font-semibold mt-4 flex items-center">
            <FiCreditCard className="h-5 w-5 mr-2" />
            Phương Thức Thanh Toán
          </h3>
          <div className="mt-2">
            <label className="ml-4">
              <input
                type="radio"
                value="onlinepay"
                checked={paymentMethod === "onlinepay"}
                onChange={() => setPaymentMethod("onlinepay")}
              />
              Thanh toán bằng thông tin tài khoản bên bán
            </label>
            <label className="ml-4">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Trả Tiền Khi Nhận Hàng
            </label>
          </div>
        </div>
        <div className="flex-1 border rounded shadow-md p-5">
          {/* <h2 className="text-xl font-bold mb-4">Chi Tiết Đơn Hàng</h2> */}
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiFileText className="h-6 w-6 mr-2" />
            Chi Tiết Đơn Hàng
          </h2>
          {sellerIds.length > 0 ? (
            sellerIds.map((sellerId, index) => {
              const sellerInfo = sellerInfos[index];
              const sellerItems = groupedItems[sellerId].items;
              const sellerTotal = groupedItems[sellerId].total;
              const sellerShippingCost = shippingCosts[sellerId] || 0;

              return (
                <div key={sellerId} className="mb-10">
                  {/* <h3 className="text-lg font-semibold">
                    Người bán: {sellerInfo?.name || "Đang tải..."}
                  </h3> */}
                  {/* <h3 className="text-lg font-semibold flex items-center">
                    <FiUser className="h-5 w-5 mr-2" />

                    Người bán: {sellerInfo?.name || "Đang tải..."}
                  </h3> */}
                  <h3 className="text-lg font-semibold flex items-center">
                    <FiUser className="h-5 w-5 mr-2" />
                    Người bán: {sellerInfo?.name || "Đang tải..."}
                  </h3>
                  <ul className="divide-y divide-gray-300">
                    {sellerItems.map((item) => (
                      <li
                        key={item._id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          {/* <img
                          {/* <img
                            src={item.product_imageUrl}
                            alt={item.product_name}
                            className="w-16 h-16 object-cover rounded mr-4"
                          /> */}
                          {item.product_imageUrl
                            ?.toLowerCase()
                            .endsWith(".mp4") ? (
                            <video className="w-16 h-16 object-cover rounded mr-4">
                              <source
                                src={item.product_imageUrl}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={item.product_imageUrl}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold">
                              {item.product_name}
                            </h3>
                            <p className="text-gray-500">
                              Đơn giá: {item.product_price.toLocaleString()} VNĐ
                            </p>
                            <p className="text-gray-500">
                              Số lượng: {item.product_quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold">
                          {(
                            item.product_price * item.product_quantity
                          ).toLocaleString()}{" "}
                          VNĐ
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between font-bold mt-2">
                    <span>(Phí vận chuyển):</span>
                    <span>{sellerShippingCost.toLocaleString()} VNĐ</span>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Giỏ hàng trống.</p>
          )}
          <hr className="my-4" />
          <div className="flex justify-between font-bold">
            {/* <span>Tổng Giá (bao gồm phí vận chuyển):</span> */}
            <span className="flex items-center">
              Tổng Giá (bao gồm phí vận chuyển):
            </span>
            <span>
              {(
                Object.values(groupedItems).reduce(
                  (acc, group) => acc + group.total,
                  0
                ) +
                Object.values(shippingCosts).reduce(
                  (acc, cost) => acc + cost,
                  0
                )
              ).toLocaleString()}{" "}
              VNĐ
            </span>
          </div>
          <div className="flex justify-end items-end">
            <button
              onClick={handleCheckout}
              className="mt-5 bg-red-500 text-white border-4 border-red-500 rounded p-2 hover:border-white flex items-center"
            >
              <FiShoppingCart className="h-5 w-5 mr-2" />
              <span className="font-bold">Thanh Toán</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
