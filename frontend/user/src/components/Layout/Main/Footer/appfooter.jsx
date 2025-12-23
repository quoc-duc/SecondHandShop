import React from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const AppFooter = () => {
  const userInfoString = sessionStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const navigate = useNavigate();

  const handleLinkClick = (path) => {
    if (userInfo) {
      navigate(path);
    } else {
      alert("Bạn chưa đăng nhập!");
    }  };

  return (
    <footer className="bg-black text-white pb-5">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 pt-12 px-12">
        {/* Exclusive Offer Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Độc quyền</h3>
          {/* <p>Nhận giảm giá 10% cho đơn hàng đầu tiên của bạn.</p> */}
          <p>Hãy cùng trải nghiệm trang web mua bán hàng của chúng tôi - nó sẽ đáp ứng được nhu cầu mua bán của bạn,
             bạn có nhu cầu mua, bạn có nhu cầu bán - hãy đến với chúng tôi.
          </p>
          {/* <div className="flex items-stretch border-gray-300">
            <input
              type="email"
              placeholder="Nhập email"
              className="p-2 rounded-l-md text-black w-full"
            />
            <button className="bg-white px-4 rounded-r-md flex items-center">
              <span className="sr-only">Submit</span>
              <FaPaperPlane className="text-black" />
            </button>
          </div> */}
        </div>

        {/* Support Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Hỗ trợ</h3>
          <p>Số 1 Võ Văn Ngân, Thủ Đức, TP HCM</p>
          <p>oldproductteams1@gmail.com</p>
          <p>+88015-88888-9999</p>
        </div>

        {/* Account Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Tài khoản</h3>
          <ul className="space-y-1">
            <li>
              {/* <a href="#" className="hover:underline">
                Tài khoản của tôi
              </a> */}
              <button type="button" className="hover:underline" onClick={() => handleLinkClick(`/profile/${userInfo?._id}`)}>
                Tài khoản của tôi
              </button>
            </li>
            <li>
              {/* <a href="#" className="hover:underline">
                Đăng nhập / Đăng ký
              </a> */}
              <button type="button" className="hover:underline" onClick={() => handleLinkClick('/cart')}>
                Giỏ hàng
              </button>
            </li>
            <li>
              {/* <a href="#" className="hover:underline">
                Giỏ hàng
              </a> */}
              <button type="button" className="hover:underline" onClick={() => handleLinkClick(`/order/${userInfo._id}`)}>
                Đơn hàng
              </button>
            </li>
            <li>
              {/* <a href="#" className="hover:underline">
                Cửa hàng
              </a> */}
              <button type="button" className="hover:underline" onClick={() => handleLinkClick(`/editSale/${userInfo._id}`)}>
                Trang bán hàng
              </button>
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Liên kết nhanh</h3>
          <ul className="space-y-1">
            {/* <li>
              <a href="#" className="hover:underline">
                Chính sách
              </a>
            </li> */}
            <li>
              {/* <a href="#" className="hover:underline">
                Quy định
              </a> */}
              <button type="button" className="hover:underline" onClick={() => navigate('/regulations')}>
                Quy định chung
              </button>
            </li>
            <li>
              {/* <a href="#" className="hover:underline">
                Câu hỏi
              </a> */}
              <button type="button" className="hover:underline" onClick={() => navigate('/feedback')}>
                Câu hỏi
              </button>
            </li>
            {/* <li>
              <a href="#" className="hover:underline">
                Liên hệ
              </a>
            </li> */}
          </ul>
        </div>

        {/* App Download Section */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Ứng dụng</h3>
          <div className="flex space-x-2">
            {/* <a href="#">
              <img
                src="./assets/footer/Google_Play_logo.png"
                alt="Get it on Google Play"
                className="h-10"
              />
            </a>
            <a href="#">
              <img
                src="./assets/footer/App_store_logo.png"
                alt="Download on the App Store"
                className="h-10"
              />
            </a> */}
            <p>Đã có bản ứng dụng trên nền tảng di động.</p>
          </div>
          <div className="flex space-x-3 mt-4 text-white">
            <a href="#">
              <i className="fab fa-facebook text-white"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-800 pt-4 text-center text-sm text-gray-600 w-full p-0">
        © Copyright OldProductTeam. All rights reserved.
      </div>
    </footer>
  );
};

export default AppFooter;
