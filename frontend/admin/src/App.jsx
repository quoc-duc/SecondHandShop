import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import AccountManage from "./pages/AccountManage";
import ProductManage from "./pages/ProductManage";
import FeedbackManage from "./pages/FeedbackManage";
import CategoryManage from "./pages/CategoryManage";
import NotificationManage from "./pages/NotificationManage";
import RegulationManage from "./pages/RegulationManage";
import PartnerManage from "./pages/PartnerManage";
import OrderManage from "./pages/OrderManage";
import Login from "./pages/Login";
import PrivateRoute from "./privateroute/PrivateRoute";
import ReviewManage from "./pages/ReviewManage";
import PaymentResult from "./components/OrderManage/PaymentResult";
import CategoryDetailList from "./components/CategoryManage/CategoryDetailList";

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AccountManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/posts"
        element={
          <PrivateRoute>
            <AdminLayout>
              <ProductManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/partner"
        element={
          <PrivateRoute>
            <AdminLayout>
              <PartnerManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/feedbacks"
        element={
          <PrivateRoute>
            <AdminLayout>
              <FeedbackManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/category"
        element={
          <PrivateRoute>
            <AdminLayout>
              <CategoryManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/order"
        element={
          <PrivateRoute>
            <AdminLayout>
              <OrderManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <PrivateRoute>
            <AdminLayout>
              <NotificationManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/regulation"
        element={
          <PrivateRoute>
            <AdminLayout>
              <RegulationManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/review"
        element={
          <PrivateRoute>
            <AdminLayout>
              <ReviewManage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route path="/admin/payment-result" element={<PaymentResult />} />
      <Route
        path="/admin/category/:categoryId/details"
        element={<CategoryDetailList />}
      />
    </Routes>
  </Router>
);

export default App;
