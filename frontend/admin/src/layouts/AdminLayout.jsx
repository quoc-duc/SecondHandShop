import PropTypes from "prop-types";
import React from "react";
import LeftSidebar from "../components/LeftSidebar";
import AccountOverview from "../components/ui/AccountOverview";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex w-full h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="fixed top-0 left-0 w-1/6 bg-white h-full z-10">
        <LeftSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pl-1/6 bg-gray-100">
        <main className="flex flex-col space-y-4">{children}</main>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
