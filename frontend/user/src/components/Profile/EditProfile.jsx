import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfile, useLocationAddress } from "../../hooks/Users";
import BackButton from "../../commons/BackButton";
import nonAvata from "../../assets/img/nonAvata.jpg";

const EditProfile = () => {
  const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [qrImage, setQrImage] = useState(null);
  const [qrUrl, setQrUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isPartnerRegistration, setIsPartnerRegistration] = useState(false);
  const navigate = useNavigate();
  const [provinceId, setProvinceId] = useState(userInfo.provinceId || "");
  const [districtId, setDistrictId] = useState(userInfo.districtId || "");
  const { provinces, districts } = useLocationAddress(provinceId);
  const [bankName, setBankName] = useState(""); // State cho tên ngân hàng
  const [cardHolderName, setCardHolderName] = useState(""); // State cho tên chủ tài khoản
  const [accountNumber, setAccountNumber] = useState(""); // State cho số tài khoản

  const phoneInputRef = useRef(null);

  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email || "");
      setUsername(userInfo.username || "");
      setName(userInfo.name || "");
      setAddress(userInfo.address || "");
      setPhone(userInfo.phone || "");
      setQrUrl(userInfo.qrPayment || "");
      setBankName(userInfo.bankName || ""); 
      setCardHolderName(userInfo.cardHolderName || ""); 
      setAccountNumber(userInfo.accountNumber || "");
    }
  }, []);

  const handleEdit = () => {
    if (userInfo) {
      setIsEditing(true);
    } else {
      alert("Bạn chưa đăng nhập!");
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setAvatarFile(selectedImage);
  };

  const handleQrChange = (e) => {
    const selectedQrImage = e.target.files[0];
    setQrImage(selectedQrImage);
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "images_preset");
    formData.append("cloud_name", "dd6pnq2is");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dd6pnq2is/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url; // Trả về URL của ảnh đã upload
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const updatedUserInfo = {
      email,
      username,
      name,
      address,
      phone,
      provinceId,
      districtId,
      qrPayment: qrUrl,
      bankName, // Thêm bankName vào đối tượng cập nhật
      cardHolderName, // Thêm cardHolderName vào đối tượng cập nhật
      accountNumber,
    };

    try {
      // Upload mã QR nếu có
      if (qrImage) {
        const uploadedQrUrl = await uploadImage(qrImage);
        updatedUserInfo.qrPayment = uploadedQrUrl; // Lưu URL mã QR
      }

      const phonePattern = /^0\d{9}$/;
      if (!phonePattern.test(phone)) {
        alert("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
        setPhone("");
        phoneInputRef.current.focus();
        return;
      }

      // Cập nhật thông tin cá nhân
      const user = await updateProfile(userInfo._id, updatedUserInfo);
      alert("Thông tin cá nhân đã được cập nhật!");
      sessionStorage.setItem("userInfo", JSON.stringify(user));
      setIsEditing(false);
      navigate(`/profile/${userInfo._id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleAvatarSave = async () => {
    if (avatarFile) {
      try {
        const uploadedAvatarUrl = await uploadImage(avatarFile);
        const user = await updateProfile(userInfo._id, {
          avatar_url: uploadedAvatarUrl,
        });
        alert("Hình đại diện đã được cập nhật!");
        sessionStorage.setItem("userInfo", JSON.stringify(user));
        setAvatarFile(null); // Đặt lại trạng thái sau khi lưu
      } catch (error) {
        console.error("Error updating avatar:", error);
        alert("Đã có lỗi xảy ra khi cập nhật hình đại diện, vui lòng thử lại.");
      }
    } else {
      alert("Vui lòng chọn hình đại diện mới!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset the form fields to the initial values
    if (userInfo) {
      setEmail(userInfo.email || "");
      setUsername(userInfo.username || "");
      setName(userInfo.name || "");
      setAddress(userInfo.address || "");
      setPhone(userInfo.phone || "");
      setQrUrl(userInfo.qrPayment || "");
    }
  };

  const handleRegisterAsPartner = () => {
    setIsPartnerRegistration(true);
  };

  const handleConfirmPartnerRegistration = async () => {
    alert("Đăng ký đối tác đang chờ xác nhận!");
    const updatedUserInfo = {
      email,
      username,
      name,
      address,
      phone,
      avatarFile,
      role: "regisPartner",
    };
    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(phone)) {
      alert("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
      phoneInputRef.current.focus();
      return;
    }
    const user = await updateProfile(userInfo._id, updatedUserInfo);
    sessionStorage.setItem("userInfo", JSON.stringify(user));
    setIsPartnerRegistration(false);
  };

  const handleCancelPartnerRegistration = () => {
    setIsPartnerRegistration(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 mb-6">
      <div className="flex items-center mb-4">
        <BackButton />
      </div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Chỉnh Sửa Thông Tin Cá Nhân
      </h2>
      <div className="flex mb-6">
        <div className="w-1/3">
          <div className="w-full bg-white flex flex-col items-center justify-center rounded-lg">
            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mt-4">
              {userInfo.avatar_url ? (
                <img
                  src={userInfo.avatar_url}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={nonAvata}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full rounded-md p-2"
            />
            <button
              onClick={handleAvatarSave}
              className="mt-2 bg-white text-blue-600 border border-blue-600 p-2 rounded-md hover:underline"
            >
              Thay đổi hình đại diện
            </button>
            {/* <div className="flex-none text-center">
              <h2 className="text-xl font-semibold mt-4">Mã QR:</h2>
              {qrUrl ? (
                <img
                  src={qrUrl}
                  alt="Mã QR"
                  className="w-60 h-auto border rounded mb-4"
                />
              ) : (
                <div className="text-xl font-bold mb-4">Chưa có</div>
              )}
            </div> */}
          </div>
        </div>
        <div className="w-2/3 ml-4">
          <form onSubmit={handleSave}>
            <div className="flex mb-4">
              <div className="w-1/2 pr-2">
                <label className="block text-sm font-medium">Họ tên</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly={!isEditing}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    isEditing ? "border-blue-500" : "bg-gray-200"
                  }`}
                  required
                />
              </div>
              <div className="w-1/2 pl-2">
                <label className="block text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  readOnly={!isEditing}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    isEditing ? "border-blue-500" : "bg-gray-200"
                  }`}
                  required
                />
              </div>
            </div>
            <div className="flex mb-4">
              <div className="w-1/2 pr-2">
                <label className="block text-sm font-medium">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={phone}
                  ref={phoneInputRef}
                  onChange={(e) => setPhone(e.target.value)}
                  readOnly={!isEditing}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    isEditing ? "border-blue-500" : "bg-gray-200"
                  }`}
                  required
                />
              </div>
              <div className="w-1/2 pl-2">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!isEditing}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    isEditing ? "border-blue-500" : "bg-gray-200"
                  }`}
                  required
                />
              </div>
            </div>
            <div className="flex mb-4">
              <div className="w-1/2 pr-2">
                <label className="block text-sm font-medium">
                  Tỉnh / Thành phố
                </label>
                <select
                  value={provinceId}
                  onChange={(e) => {
                    setProvinceId(e.target.value);
                    setDistrictId(""); // reset quận/huyện khi đổi tỉnh
                  }}
                  disabled={!isEditing}
                  className="mt-1 p-2 w-full border rounded"
                  required
                >
                  <option value="">-- Chọn Tỉnh / Thành phố --</option>
                  {provinces.map((prov) => (
                    <option key={prov.PROVINCE_ID} value={prov.PROVINCE_ID}>
                      {prov.PROVINCE_NAME}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-1/2 pl-2">
                <label className="block text-sm font-medium">
                  Quận / Huyện
                </label>
                <select
                  value={districtId}
                  onChange={(e) => setDistrictId(e.target.value)}
                  disabled={!isEditing}
                  className="mt-1 p-2 w-full border rounded"
                  required
                >
                  <option value="">-- Chọn Quận / Huyện --</option>
                  {districts.map((dist) => (
                    <option key={dist.DISTRICT_ID} value={dist.DISTRICT_ID}>
                      {dist.DISTRICT_NAME}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Địa chỉ</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                readOnly={!isEditing}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  isEditing ? "border-blue-500" : "bg-gray-200"
                }`}
                rows="3"
                required
              />
            </div>
            <div className="flex mb-4">
          <div className="w-1/2 pr-2">
            <label className="block text-sm font-medium">Tên ngân hàng</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              readOnly={!isEditing}
              className={`mt-1 block w-full border rounded-md p-2 ${
                isEditing ? "border-blue-500" : "bg-gray-200"
              }`}
            />
          </div>
          {/* Thêm input cho tên chủ tài khoản */}
          <div className="w-1/2 pl-2">
            <label className="block text-sm font-medium">Tên chủ tài khoản</label>
            <input
              type="text"
              value={cardHolderName}
              onChange={(e) => setCardHolderName(e.target.value)}
              readOnly={!isEditing}
              className={`mt-1 block w-full border rounded-md p-2 ${
                isEditing ? "border-blue-500" : "bg-gray-200"
              }`}
            />
          </div>
        </div>

        {/* Thêm input cho số tài khoản */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Số tài khoản</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            readOnly={!isEditing}
            className={`mt-1 block w-full border rounded-md p-2 ${
              isEditing ? "border-blue-500" : "bg-gray-200"
            }`}/>
        </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium">Mã QR</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrChange}
                className={`mt-1 block w-full border rounded-md p-2 ${
                  isEditing ? "border-blue-500" : "bg-gray-200"
                }`}
                disabled={!isEditing}
              />
            </div> */}
            <div className="flex justify-end space-x-2">
              {!isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="bg-white text-blue-600 p-2 border border-blue-600 rounded-md hover:bg-gray-200 underline"
                  >
                    Chỉnh sửa
                  </button>
                  {/* {userInfo.role === "user" ? (
                    <button
                      type="button"
                      onClick={handleRegisterAsPartner}
                      className="bg-white text-blue-600 p-2 border border-blue-600 rounded-md hover:bg-gray-200 underline"
                    >
                      Đăng ký đối tác
                    </button>
                  ) : userInfo.role === "regisPartner" ? (
                    <button
                      type="button"
                      onClick={handleRegisterAsPartner}
                      className="bg-white text-blue-600 p-2 border border-blue-600 rounded-md hover:bg-gray-200 underline"
                    >
                      Đang chờ xác nhận
                    </button>
                  ) : userInfo.role === "partner" ? (
                    <button
                      type="button"
                      onClick={handleRegisterAsPartner}
                      className="bg-white text-blue-600 p-2 border border-blue-600 rounded-md hover:bg-gray-200 underline"
                    >
                      Xem lại quy định đối tác
                    </button>
                  ) : null} */}
                </>
              )}
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
                  >
                    Huỷ
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                  >
                    Lưu
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {isPartnerRegistration && (
        <div className="mt-6 p-4 border border-gray-300 rounded-md">
          <h3 className="text-lg font-semibold mb-2">
            Yêu cầu đăng ký đối tác
          </h3>
          <ul className="list-disc ml-5">
            <li>Cập nhật thông tin cá nhân chính xác và minh bạch.</li>
            <li>Cam kết thực hiện các giao dịch một cách trung thực.</li>
            <li>
              Chịu trách nhiệm về các sản phẩm và dịch vụ mà bạn cung cấp.
            </li>
            <li>Đảm bảo tuân thủ các quy định của nền tảng.</li>
          </ul>
          {userInfo.role === "user" ? (
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={handleConfirmPartnerRegistration}
                className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
              >
                Xác nhận đăng ký
              </button>
              <button
                type="button"
                onClick={handleCancelPartnerRegistration}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Huỷ đăng ký
              </button>
            </div>
          ) : userInfo.role === "regisPartner" ? (
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Yêu cầu đăng ký của bạn đang chờ xác nhận
            </button>
          ) : userInfo.role === "partner" ? (
            <button
              type="button"
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Bạn đã là đối tác
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EditProfile;
