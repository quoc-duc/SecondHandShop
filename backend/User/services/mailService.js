// mailService.js
import { createTransport } from "nodemailer";

// Cấu hình transporter
const transporter = createTransport({
  service: "gmail", // Có thể thay đổi dịch vụ nếu cần
  auth: {
    user: "minhquan31102003@gmail.com", // Email của bạn
    pass: "vvga vwdp vkya lnuf", // Mật khẩu email hoặc mật khẩu ứng dụng
  },
  tls: {
    rejectUnauthorized: false, // Bỏ qua kiểm tra chứng chỉ
  },
});

// Hàm gửi mã OTP
const sendOtpEmail = async (recipientEmail, otp) => {
  const mailOptions = {
    from: "minhquan31102003@gmail.com",
    to: recipientEmail,
    subject: "Mã OTP xác thực",
    text: `Mã OTP của bạn là: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Mã OTP đã được gửi thành công.");
  } catch (error) {
    console.error("Lỗi khi gửi mã OTP:", error);
    throw new Error("Không thể gửi mã OTP. Vui lòng thử lại." + error);
  }
};

export default sendOtpEmail;
