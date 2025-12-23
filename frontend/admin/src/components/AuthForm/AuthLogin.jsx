import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../hooks/useAuth";
import imageLink from "../../assets/login/login.jpg";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const AuthLogin = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex items-center h-screen bg-whitel w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full my-20">
        <div className="hidden md:flex items-center justify-start">
          <img src={imageLink} alt="Shopping" className="w-[100%] h-screen" />
        </div>

        <form
          className="max-w-sm mx-auto my-auto justify-start rounded-md bg-white w-full"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-semibold mb-4">Đăng Nhập</h2>
          <p className="primary mb-6">Nhập thông tin</p>

          {error && <div className="text-red-500 mb-6">{error}</div>}

          <label className="block mb-4">
            <span className="sr-only">Nhập Email</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
              required
            />
          </label>

          <label className="block mb-4 relative">
            <span className="sr-only">Mật Khẩu</span>
            <input
              type={showPassword ? "text" : "password"} // 👈 chuyển đổi giữa text/password
              placeholder="Mật Khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 pr-10 border-b border-gray-300 focus:outline-none focus:border-red-500"
              required
            />
            {/* 👁️ icon bật/tắt */}
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-xl text-gray-400"
            >
              {showPassword ? <LuEyeClosed /> : <LuEye />}
            </span>
          </label>

          <button
            type="submit"
            className="w-full bg-red-500 text-white p-3 rounded mt-4 font-semibold"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

AuthLogin.propTypes = {
  onSubmit: PropTypes.func.isRequired, // Remove if not needed
};

export default AuthLogin;
