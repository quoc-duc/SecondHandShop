import React, { useEffect, useState } from "react";
import { addProduct, getAllCountries } from "../../hooks/Products";
import { getCategories, fetchSubcategories, fetchOrigin } from "../../hooks/Categories";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, updateOneProduct } from "../../hooks/Products";
import { FiImage, FiVideo, FiUpload, FiBox, FiSave, FiLogOut } from 'react-icons/fi';

const ProductUpload = () => {
  const userInfoString = sessionStorage.getItem("userInfo");
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  const { productId } = useParams();
  const [media, setMedia] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [condition, setCondition] = useState("Mới");
  const [origin, setOrigin] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { categories } = getCategories();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]); 
  const [isOtherOrigin, setIsOtherOrigin] = useState(false);
  const [otherOrigin, setOtherOrigin] = useState("");
  const [img, setimg] = useState("");
  const [video, setvideo] = useState("");

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    const subCategories = await fetchSubcategories(categoryId);
    setSubcategories(subCategories);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const product = await getProductById(productId);
        if (product) {
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setQuantity(product.quantity);
          setBrand(product.brand);
          setCondition(product.condition);
          fetchOrigin();
          setOrigin(product.origin);
          setWeight(product.weight);
          setSelectedCategory(product.category_id);
          handleCategoryChange(product.category_id)
          setSelectedSubcategory(product.subcategory_name)
          const Media = product.image_url || product.video_url
          const isVideo =
            Media?.toLowerCase().endsWith(".mp4") ||
            Media?.toLowerCase().endsWith(".mov") ||
            Media?.toLowerCase().endsWith(".webm");
          isVideo ? setvideo(product.video_url) : (setimg(product.image_url))
          setMediaUrl(product.image_url || product.video_url);
        }
      } else {
        resetForm();
      }
    };

    const fetchCountries = async () => {
      const countryData = await getAllCountries();
      setCountries(countryData);
    };
    
    fetchCountries();
    fetchProduct();
  }, [productId]);

  const resetForm = () => {
    setMedia(null);
    setMediaUrl("");
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setBrand("");
    setCondition("Mới");
    setWeight("");
    setOrigin("");
    setSelectedCategory("");
    setIsOtherOrigin(false);
    setOtherOrigin("");
  };

  const handleMediaChange = (e) => {
    const selectedMedia = e.target.files[0];
    setMedia(selectedMedia);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId && !media) {
      alert("Vui lòng chọn hình ảnh hoặc video.");
      return;
    }

    if (
      !name ||
      !description ||
      !price ||
      !quantity ||
      !brand ||
      !selectedCategory
    ) {
      alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
      return;
    }

    const formData = new FormData();
    formData.append("file", media);
    formData.append("upload_preset", "images_preset");
    formData.append("cloud_name", "dd6pnq2is");

    try {
      let url = ''
      if (media) {
        const uploadUrl = media.type.startsWith("image/")
          ? "https://api.cloudinary.com/v1_1/dd6pnq2is/image/upload"
          : "https://api.cloudinary.com/v1_1/dd6pnq2is/video/upload";

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
        });

        const uploadedMediaUrl = await response.json();
        setMediaUrl(uploadedMediaUrl.secure_url);
        url = uploadedMediaUrl.secure_url
      }
      
      let partner = userInfo.role === "partner";

      const urlVideo = url?.toLowerCase().endsWith(".mp4") ? url : '';
      const urlImg = url?.toLowerCase().endsWith(".jpg") || url?.toLowerCase().endsWith(".png") ? url : '';

      const productData = {
        name,
        description,
        price,
        quantity,
        user_id: userInfo._id,
        category_id: selectedCategory,
        subcategory_name: selectedSubcategory,
        image_url: productId ? (media ? urlImg : img) : urlImg,
        video_url: productId ? (media ? urlVideo : img) : urlVideo,
        brand,
        condition,
        weight,
        origin,
        partner,
        approve: false,
        status: true,
      };

      if (productId) {
        await updateOneProduct(productId, productData);
        alert("Bạn đã chỉnh sửa sản phẩm thành công.");
      } else {
        await addProduct(productData);
        alert("Bạn đã đăng sản phẩm thành công.");
      }
      navigate(`/editSale/${userInfo._id}`);
      resetForm();
    } catch (error) {
      console.error("Error uploading media:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 mb-6 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          <FiUpload className="inline-block mr-2 mb-2 font-bold text-yellow-400" />
          Đăng Sản Phẩm Mới
      </h2>
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/2 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">
              <FiImage className="inline-block mr-2 mb-1 text-yellow-400" />
              Hình Ảnh hoặc Video
          </h3>
          <div className="mb-4">
              <label className="flex items-center justify-center hover:underline hover:underline-yellow-400 cursor-pointer border border-gray-300 rounded p-2 w-full">
                  <FiUpload className="mr-2 text-yellow-400" />
                  <span>Chọn Hình Ảnh hoặc Video</span>
                  <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaChange}
                      className="hidden"
                  />
              </label>
          </div>
          {media && (
            <div>
              <p className="text-sm text-gray-700">Đã chọn: {media.name}</p>
              {media.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(media)}
                  alt="Product"
                  className="mt-2 w-full h-auto rounded"
                />
              ) : (
                <video controls className="mt-2 w-full h-auto rounded">
                  <source src={URL.createObjectURL(media)} type={media.type} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          {mediaUrl && (
            <div>
              {mediaUrl.endsWith(".mp4") ? (
                <video controls className="mt-2 w-full h-auto rounded">
                  <source src={mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={mediaUrl}
                  alt="Uploaded"
                  className="mt-2 w-full h-auto rounded"
                />
              )}
            </div>
          )}
        </div>
        <div className="md:w-1/2 p-4 border border-gray-300 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-yellow-400">
              <FiBox className="inline-block mr-2 text-yellow-400 mb-1" />
              Thông Tin Sản Phẩm
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-gray-700">Tên sản phẩm</label>
              <input
                type="text"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-700">Mô tả sản phẩm</label>
              <textarea
                placeholder=" "
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-700">Giá</label>
              <input
                type="number"
                placeholder=" "
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-700">Số lượng</label>
              <input
                type="number"
                placeholder=" "
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-700">Khối lượng mỗi sản phẩm (g)</label>
              <input
                type="number"
                placeholder=" "
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
                min="0"
              />
            </div>
            <div className="mb-4">
              <label className="text-gray-700">Hãng</label>
              <input
                type="text"
                placeholder=" "
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
              >
                <option value="Mới">Mới</option>
                <option value="Đã qua sử dụng">Đã qua sử dụng</option>
                <option value="Tái chế">Tái chế</option>
              </select>
            </div>
            <div className="mb-4">
              <select
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setIsOtherOrigin(e.target.value === "Khác");
                }}
                className="border border-gray-300 p-2 w-full rounded"
                required
              >
                <option value="">Chọn xuất xứ</option>
                {countries.map((country) => (
                  <option key={country._id} value={country.name}>
                    {country.name}
                  </option>
                ))}
                <option value="Khác">Khác</option>
              </select>
            </div>
            {isOtherOrigin && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Nhập xuất xứ khác"
                  value={otherOrigin}
                  onChange={(e) => setOtherOrigin(e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>
            )}
            <div className="mb-4">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded"
                required
              >
                <option value="">Chọn danh mục con</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory.name}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex">
              {productId ? (
                <>
                  <button className="bg-yellow-400 text-xl font-bold text-white p-2 rounded hover:bg-yellow-300 transition duration-200 w-full">
                    <FiSave className="inline-block mr-2 mb-1" />
                    Lưu
                  </button>
                  <button
                    onClick={() => navigate(`/editSale/${userInfo._id}`)}
                    className="bg-red-500 ml-6 text-white p-2 rounded hover:bg-red-400 transition duration-200 w-full"
                  >
                    <FiLogOut className="inline-block mr-2 mb-1" />
                    Thoát
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    className="bg-yellow-400 text-white p-2 rounded hover:bg-yellow-300 transition duration-200 w-full"
                  >
                    <FiUpload className="inline-block mr-2 text-white mb-1" />
                    <span className="font-bold">Đăng Sản Phẩm</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm} // Xử lý sự kiện cho nút hủy
                    className="bg-gray-500 ml-6 text-white p-2 rounded hover:bg-gray-400 transition duration-200 w-full"
                  >
                    <FiLogOut className="inline-block mr-2 mb-1" />
                    Hủy
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;