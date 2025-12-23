import { useState, useRef  } from "react";
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hooks/auth";
import imageLink from "../../assets/login/login.jpg";

const AuthSignUp = () => {
    const navigate = useNavigate();
    const { signup, sendOtp, verifyOtp, error } = useAuth();
    const [name, setName] = useState("");
    // const [username, setUsername] = useState("");
    // const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const phoneInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmpassword) {
            alert("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        const phonePattern = /^0\d{9}$/;
        if (!phonePattern.test(phone)) {
            alert("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
            setPhone('');
            phoneInputRef.current.focus();
            return;
        }

        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            setPassword('');
            setConfirmPassword('');
            return;
        }

        if (!otpSent) {
            const otpSentSuccess = await sendOtp(email);
            if (otpSentSuccess) {
                setOtpSent(true);
                alert("Mã OTP đã được gửi tới email của bạn.");
            }
        } else {
            const isValidOtp = await verifyOtp(email, otp);
            if (isValidOtp) {
                await signup({ name,  phone, email, password });//username, address,
                setName('');
                // setUsername('');
                // setAddress('');
                setPhone('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setOtp('');
                navigate('/login');
            } else {
                alert("Mã OTP không hợp lệ!");
            }
        }
    };

    return (
        <div className="flex items-center bg-white w-full mt-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div className="hidden md:flex items-center justify-start">
                    <img src={imageLink} alt="Shopping" className="w-[90%] h-auto" />
                </div>

                <form
                    className="max-w-sm mx-auto my-auto justify-start rounded-md bg-white w-full"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-3xl font-semibold mb-4">Đăng Ký</h2>
                    <p className="primary mb-6">Nhập thông tin để đăng ký</p>

                    {error && <div className="text-red-500 mb-6">{error}</div>}

                    <label className="block mb-4">
                        <span className="sr-only">Họ tên</span>
                        <input
                            type="text"
                            placeholder="Họ tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
                            required
                        />
                    </label>

                    {/* <label className="block mb-4">
                        <span className="sr-only">Username</span>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
                            required
                        />
                    </label> */}

                    {/* <label className="block mb-4">
                        <span className="sr-only">Địa chỉ</span>
                        <input
                            type="text"
                            placeholder="Địa chỉ"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
                            required
                        />
                    </label> */}

                    <label className="block mb-4">
                        <span className="sr-only">Số điện thoại</span>
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={phone}
                            ref={phoneInputRef} 
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
                            required
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="sr-only">Email</span>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
                            required
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="sr-only">Mật Khẩu</span>
                        <input
                            type="password"
                            placeholder="Mật Khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
                            required
                        />
                    </label>

                    <label className="block mb-4">
                        <span className="sr-only">Xác Nhận Mật Khẩu</span>
                        <input
                            type="password"
                            placeholder="Xác Nhận Mật Khẩu"
                            value={confirmpassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
                            required
                        />
                    </label>

                    {otpSent && (
                        <>
                        <label className="block mb-4">
                            <span className="sr-only">Mã OTP</span>
                            <input
                                type="text"
                                placeholder="Nhập mã OTP đã gửi đến email"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full py-3 border-b border-gray-300 focus:outline-none focus:border-red-500"
                                required
                            />
                        </label>
                        {otpSent ? 
                        <button
                        className="w-full bg-white text-red-500 p-2 rounded mt-4 font-semibold hover hover:underline"
                        onClick={()=>{sendOtp(email)}}
                    >
                        Gửi lại mã OTP
                    </button> : null}
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white p-3 rounded mt-4 font-semibold"
                    >
                        {otpSent ? "Xác Nhận Đăng Ký" : "Gửi Mã OTP"}
                    </button>

                    <div className="flex justify-start mt-4">
                        <a href="/login" className="text-sm text-blue-600 pr-5 underline">Đã có tài khoản?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

AuthSignUp.propTypes = {};

export default AuthSignUp;