import React, { useState } from "react";
import useUser from "../../hooks/useUser";
import useFeedback from "../../hooks/useFeedback";
import { HiOutlineUserGroup } from "react-icons/hi2";
import {
  AiOutlineUsergroupDelete,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { VscFeedback } from "react-icons/vsc";
import useRegulation from "../../hooks/useRegulation";

const AccountOverview = () => {
  const { totalUsers } = useUser("users");
  const { totalBans } = useUser("banned");
  const { totalRegulations } = useRegulation();
  const { totalFeedbacks } = useFeedback();

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-md mt-4 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mx-4">
        <div className="flex flex-col items-center bg-blue-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <HiOutlineUserGroup />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">{totalUsers}</div>
            <div className="text-sm text-white">Tài khoản</div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-red-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <AiOutlineUsergroupDelete />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">{totalBans}</div>
            <div className="text-sm text-white">Tài khoản bị cấm</div>
          </div>
        </div>
        <div className="flex flex-col items-center bg-yellow-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <AiOutlineUsergroupAdd />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {totalRegulations}
            </div>
            <div className="text-sm text-white">Quy định</div>
          </div>
        </div>

        <div className="flex flex-col items-center bg-green-500 py-8 hover:scale-105 transition-all duration-300 ease-in-out">
          <div className="text-3xl mb-4 text-white p-1 rounded-lg hover:transform hover:scale-125">
            <VscFeedback />
          </div>
          <div className="flex text-center items-center space-x-6">
            <div className="text-lg font-medium text-white">
              {totalFeedbacks}
            </div>
            <div className="text-sm text-white">Đóng góp ý kiến</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
