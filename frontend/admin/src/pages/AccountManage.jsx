import React, { useState } from "react";
import UserList from "../components/AccountManage/UserList.jsx";
import BanUserList from "../components/AccountManage/BanUserList.jsx";
import AccountOverview from "../components/ui/AccountOverview.jsx";

const AccountManage = () => {
  const [view, setView] = useState("list");
  return (
    <div className="w-5/6 ml-[16.6666%] p-4 bg-gray-100 rounded-md ">
      <AccountOverview />
      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded-md ${
            view === "list"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Danh sách tài khoản
        </button>
        <button
          onClick={() => setView("ban")}
          className={`px-4 py-2 rounded-md ${
            view === "ban"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Danh sách tài khoản bị cấm
        </button>
      </div>

      {view === "list" ? <UserList /> : <BanUserList />}
    </div>
  );
};
export default AccountManage;
