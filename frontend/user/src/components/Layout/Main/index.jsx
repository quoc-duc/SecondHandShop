import React from "react";
import PropTypes from "prop-types";
import Header from "./Header/header";
import AppFooter from "./Footer/appfooter"; // Update the import to use AppFooter

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <AppFooter />
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
