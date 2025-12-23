import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkVNPayPayment } from "../../hooks/VNPay";
import { updateOrder } from "../../hooks/Orders";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("loading");

  useEffect(() => {
    const handlePaymentResult = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const params = {};
        queryParams.forEach((value, key) => {
          params[key] = value;
        });

        const paymentResult = await checkVNPayPayment(params);

        if (paymentResult.code === "00") {
          // Thanh toán thành công, cập nhật trạng thái đơn hàng
          const orderIds = JSON.parse(
            sessionStorage.getItem("orderIds") || "[]"
          );

          for (const order of orderIds) {
            await updateOrder(order.id, {
              payment_status: "paid",
            });
          }

          setPaymentStatus("success");
          sessionStorage.removeItem("orderIds");
        } else {
          // Thanh toán thất bại, cập nhật payment_method thành "cash"
          const orderIds = JSON.parse(
            sessionStorage.getItem("orderIds") || "[]"
          );

          for (const order of orderIds) {
            await updateOrder(order.id, {
              payment_method: "cash",
            });
          }

          setPaymentStatus("failed");
          sessionStorage.removeItem("orderIds");
        }
      } catch (error) {
        console.error("Error processing payment result:", error);
        // Xử lý lỗi, cập nhật payment_method thành "cash"
        const orderIds = JSON.parse(sessionStorage.getItem("orderIds") || "[]");

        for (const order of orderIds) {
          await updateOrder(order.id, {
            payment_method: "cash",
          });
        }

        setPaymentStatus("failed");
        sessionStorage.removeItem("orderIds");
      }
    };

    handlePaymentResult();
  }, [location]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Kết quả thanh toán</h1>
      {paymentStatus === "loading" && <p>Đang xử lý...</p>}
      {paymentStatus === "success" && (
        <div>
          <p className="text-green-600">Thanh toán thành công!</p>
          <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 text-white rounded p-2"
          >
            Về trang chủ
          </button>
        </div>
      )}
      {paymentStatus === "failed" && (
        <div>
          <p className="text-red-600">Thanh toán thất bại!</p>
          <p>Bạn vui lòng thanh toán khi nhận hàng.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 text-white rounded p-2"
          >
            Về trang chủ
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentResult;
