import React from "react";

import OrderList from "../components/OrderManage/OrderList";
import PurchaseOverview from "../components/ui/PurchaseOverview.jsx";

const OrderManage = () => {
  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md ">
      <PurchaseOverview />
      <OrderList />
    </div>
  );
};

export default OrderManage;
