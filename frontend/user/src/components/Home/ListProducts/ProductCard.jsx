import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const ProductCard = ({
  id,
  name,
  description,
  price,
  quantity,
  media_url,
  partner,
}) => {
  const videoRef = useRef(null);
  // const isVideo = media_url.toLowerCase().endsWith('.mp4') || media_url.toLowerCase().endsWith('.mov') || media_url.toLowerCase().endsWith('.avi') || media_url.toLowerCase().endsWith('.wmv'); // Thêm các đuôi video khác nếu cần
  const isVideo =
    typeof media_url === "string" &&
    (media_url.toLowerCase().endsWith(".mp4") ||
      media_url.toLowerCase().endsWith(".mov") ||
      media_url.toLowerCase().endsWith(".avi") ||
      media_url.toLowerCase().endsWith(".wmv"));

  return (
    <Link
      to={`/product/${id}`}
      className="flex w-[20%] mt-2 mb-2 justify-center items-center hover:bg-gray-200"
      style={{ height: "350px", textDecoration: "none" }}
    >
      <div className="bg-white h-full w-[95%] border shadow-md p-2 m-2 transition-shadow duration-300">
        <div className="w-full h-[55%] overflow-hidden rounded-t-lg">
          {isVideo ? (
            <video
              ref={videoRef}
              className="object-cover w-full h-full"
              onMouseEnter={() => videoRef.current?.play()} // Phát video khi rê chuột vào
              onMouseLeave={() => videoRef.current?.pause()} // Tạm dừng video khi chuột rời khỏi
              muted // Đảm bảo video tự phát không có âm thanh
            >
              <source src={media_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={media_url}
              alt={name}
              className="object-cover"
              style={{ width: "250px", height: "200px" }}
            />
          )}
        </div>
        <div className="w-full h-[45%] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
            {name}
          </h2>
          <p className="text-lg font-bold text-red-500 mt-2">
            {price.toLocaleString("vi-VN")} VNĐ
          </p>
          <p className="text-gray-500">Số lượng: {quantity}</p>
        </div>
      </div>
    </Link>
  );
};

ProductCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string, //description không bắt buộc
  price: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  media_url: PropTypes.string.isRequired,
  partner: PropTypes.bool, //partner không bắt buộc
};

export default ProductCard;
