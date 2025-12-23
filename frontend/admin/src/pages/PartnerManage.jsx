import React, { useState } from "react";
import PartnerList from "../components/PartnerManage/PartnerList";
import PartnerRequest from "../components/PartnerManage/PartnerRequest";

const PartnerManage = () => {
  const [view, setView] = useState("request"); // Default view is 'request' for pending products

  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md ">
      <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Partner Management
      </h2>

      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={() => setView("request")}
          className={`px-4 py-2 rounded-md ${
            view === "request"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Partner Requests
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-md ${
            view === "list"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Partner List
        </button>
      </div>

      {view === "request" ? <PartnerRequest /> : <PartnerList />}
    </div>
  );
};
export default PartnerManage;
