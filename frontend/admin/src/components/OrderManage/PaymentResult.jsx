import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateAdminOrder } from "../../hooks/useOrder";
import { checkVNPayPayment } from "../../hooks/VNPayAdmin";

const PaymentResult = () => {
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        // Extract query parameters from URL
        const query = new URLSearchParams(location.search);
        const queryParams = {};
        query.forEach((value, key) => {
          queryParams[key] = value;
        });

        // Check VNPay payment status
        const paymentResult = await checkVNPayPayment(queryParams);

        if (paymentResult.code === "00") {
          // Payment successful, update order status
          const orderId = sessionStorage.getItem("paymentOrderId");
          if (orderId) {
            await updateAdminOrder(orderId, {
              payment_status: "released_to_seller",
            });
            setPaymentStatus("Thanh toán cho người bán thành công!");
            sessionStorage.removeItem("paymentOrderId"); // Clean up
          } else {
            setError("Không tìm thấy ID đơn hàng.");
          }
        } else {
          setPaymentStatus("Thanh toán thất bại. Vui lòng thử lại.");
        }
      } catch (err) {
        setError("Lỗi khi xử lý thanh toán: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    processPaymentResult();
  }, [location]);

  const handleBackToOrders = () => {
    navigate("/admin/order"); // Adjust the path as per your routing
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Kết quả thanh toán</h2>
        {loading && <p>Đang xử lý...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {paymentStatus && (
          <p
            className={
              paymentStatus.includes("thành công")
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {paymentStatus}
          </p>
        )}
        <div className="mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleBackToOrders}
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
