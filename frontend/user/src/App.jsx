import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/Login/index";
import SignupPage from "./pages/SignUp/index";
import MainLayout from "./components/Layout/Main";
import ProductDetailPage from "./pages/ProductDetail/index";
import ProductCardHome from "./pages/Home/index";
import CartPage from "./pages/Cart/index";
import CheckoutPage from "./pages/Checkout/index";
import ProductByCategogyPage from "./pages/ProductByCategogy/index";
import EditProfilePage from "./pages/EditProfile/index";
import PostProductPage from "./pages/PostProduct/index";
import Order from "./components/Order/Order";
import ProductByName from "../src/components/Search/Search";
import SellerPage from "./components/SellerPage/SellerPage";
import PurchaseOrder from "./components/Order/PurchaseOrderDetail";
import SalesOder from "./components/Order/SalesOderDetail";
import EditSalePage from "./components/EditPageSale/EditPageSale";
import PaymentInfo from "./components/Checkout/InfoPayment";
import Feedback from "./components/Feedback/Feedback";
import ReGetPassword from "./components/AuthForm/LossPassword";
import ChangePassword from "./components/AuthForm/ChangePassword";
import Regulation from "./components/Regulation/Regulation";
import Message from "./components/Message/Message";
import Chat from "./components/Message/Chat";
import PurchaseOrderDetail from "./components/Order/PurchaseOrderDetail";
import SalesOrderDetail from "./components/Order/SalesOderDetail";
import AccountDetails from "./components/Payment/AccountDetail";
import VNPayRegister from "./components/Payment/VNPayRegister";

import PaymentResult from "./components/Checkout/PaymentResult";

const App = () => {
  const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ProductCardHome />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route
            path="/product/category/:categoryId"
            element={<ProductByCategogyPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account" element={<AccountDetails />} />
          <Route path="/account/register" element={<VNPayRegister />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/profile/:id"
            element={
              userInfo ? <EditProfilePage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/post"
            element={
              userInfo ? <PostProductPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/order/:id"
            element={userInfo ? <Order /> : <Navigate to="/" replace />}
          />
          <Route path="/search" element={<ProductByName />} />
          <Route path="/seller/:sellerId" element={<SellerPage />} />
          <Route
            path="/purchaseOrder/:orderId"
            element={
              userInfo ? <PurchaseOrderDetail /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/salesOder/:orderId"
            element={
              userInfo ? <SalesOrderDetail /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/editSale/:sellerId"
            element={userInfo ? <EditSalePage /> : <Navigate to="/" replace />}
          />
          <Route path="/payment/:orderId" element={<PaymentInfo />} />
          <Route
            path="/edit/product/:productId"
            element={
              userInfo ? <PostProductPage /> : <Navigate to="/" replace />
            }
          />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/regetpassword" element={<ReGetPassword />} />
          <Route
            path="/changepassword"
            element={
              userInfo ? <ChangePassword /> : <Navigate to="/" replace />
            }
          />
          <Route path="/regulations" element={<Regulation />} />
          <Route
            path="/message/:userId"
            element={userInfo ? <Message /> : <Navigate to="/" replace />}
          />
          <Route
            path="/message/:userId/:conversationId"
            element={userInfo ? <Message /> : <Navigate to="/" replace />}
          />
          <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
