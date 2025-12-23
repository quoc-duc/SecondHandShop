import { useState } from "react";
import axios from "axios";
import { IP } from "../config";

axios.defaults.baseURL = `http://localhost:5555`;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });
      console.log("Login response:", response.data);

      const token = response.data.token;

      localStorage.setItem("token", token);
      const userResponse = await axios.post("/users/email", { email });
      if (userResponse.data.ban == true) {
        alert(
          "Tài khoản của bạn đã bị cấm!\nXin hãy liên hệ đến hệ thống bằng cách gửi Đóng góp ý kiến về tài khoản của bạn."
        );
        return;
      }
      setIsAuthenticated(true);
      sessionStorage.setItem("userInfo", JSON.stringify(userResponse.data));
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err);
      alert("Thông tin đăng nhập không hợp lệ!");
      // setError("Invalid credentials. Please try again.");
    }
  };

  const sendOtp = async (email) => {
    try {
      // alert(email)
      const response = await axios.post("/mail/send-otp", { email });
      alert(response.data.message);
      console.log("OTP sent:", response.data.message);
      return true;
    } catch (err) {
      alert("Lỗi OTP. Xin hãy thử lại. ", err);
      setError("Lỗi OTP. Xin hãy thử lại.");
      return false;
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post("/mail/verify-otp", { email, otp });
      return response.data.valid;
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Mã OTP không đúng. Hãy thử lại.");
      return false;
    }
  };

  const signup = async (userData) => {
    try {
      const mail = { email: userData.email };
      const userResponse = await axios.post("/users/email", mail);
      if (userResponse.data) {
        alert("Người dùng đã tồn tại!");
        window.location.href = "/login";
        return;
      }

      const response = await axios.post("/users", userData);
      console.log("Signup response:", response.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup error: " + (err.response?.data?.message || err.message));
      setError(
        err.response?.data?.message || "An error occurred during signup."
      );
    }
  };

  return { isAuthenticated, login, signup, sendOtp, verifyOtp, error };
};
