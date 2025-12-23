import React from "react";
import { BsCartCheck, BsCartX } from "react-icons/bs";
import { BiCoinStack } from "react-icons/bi";
import { MdShoppingCartCheckout } from "react-icons/md";
import { usePurchaseOverview } from "../../hooks/useOrder";

const PurchaseOverview = () => {
  const { overviewData, loading, error } = usePurchaseOverview();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-md mt-4 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mx-4">
        {/* Total Orders */}
        <div className="flex flex-col items-center bg-violet-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <MdShoppingCartCheckout />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {overviewData.totalOrders}
            </div>
            <div className="text-sm text-white">Tổng đơn hàng</div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="flex flex-col items-center bg-yellow-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <BiCoinStack />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {overviewData.totalMoney}
            </div>
            <div className="text-sm text-white">Tổng thanh toán</div>
          </div>
        </div>

        {/* Total Cancelled Orders */}
        <div className="flex flex-col items-center bg-rose-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <BsCartX />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {overviewData.totalCancelled}
            </div>
            <div className="text-sm text-white">Đơn hàng bị hủy</div>
          </div>
        </div>

        {/* Additional Column */}
        <div className="flex flex-col items-center bg-teal-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <BsCartCheck />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {overviewData.totalSuccessful}
            </div>
            <div className="text-sm text-white">Đơn hàng thành công</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOverview;
