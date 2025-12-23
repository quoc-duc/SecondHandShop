import mongoose from 'mongoose';
import CategoryDetails from '../User//models/CategoryDetails.js'; // Đảm bảo đường dẫn đúng
import { mongodbconn } from "../config.js"; // Sử dụng mongodbconn từ config

const addCategoryDetails = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect('mongodb+srv://minhquan31102003:f3n9fJaQYv7YYdIa@muabandocu.8c5m9.mongodb.net/?retryWrites=true&w=majority&appName=MuaBanDoCu');

        // Dữ liệu danh mục chi tiết với category_id là ID của danh mục cha
        const categoryDetailsData = [
            // Điện gia dụng
            // { name: 'Máy giặt', category_id: '672b28af84ffd1107d91686e', image_url: 'https://example.com/image1.jpg', },
            // { name: 'Tủ lạnh', category_id: '672b28af84ffd1107d91686e', image_url: 'https://example.com/image2.jpg', },
            // { name: 'Lò vi sóng', category_id: '672b28af84ffd1107d91686e', image_url: 'https://example.com/image3.jpg', },
            // { name: 'Máy hút bụi', category_id: '672b28af84ffd1107d91686e', image_url: 'https://example.com/image4.jpg', },
            // { name: 'Bếp từ', category_id: '672b28af84ffd1107d91686e', image_url: 'https://example.com/image5.jpg', },
            // { name: 'Máy sáy tóc', category_id: '672b28af84ffd1107d91686e', image_url: 'https://example.com/image5.jpg', },
            { name: 'Khác', category_id: '672b28af84ffd1107d91686e', image_url: 'https://example.com/image5.jpg', },
            
            // Đồ nội thất
            // { name: 'Sofa', category_id: '672b29c984ffd1107d916871', image_url: 'https://example.com/sofa.jpg', },
            // { name: 'Bàn ăn', category_id: '672b29c984ffd1107d916871', image_url: 'https://example.com/ban-an.jpg',  },
            // { name: 'Ghế gỗ', category_id: '672b29c984ffd1107d916871', image_url: 'https://example.com/ghe-go.jpg', },
            // { name: 'Tủ quần áo', category_id: '672b29c984ffd1107d916871', image_url: 'https://example.com/tu-quan-ao.jpg', },
            // { name: 'Kệ sách', category_id: '672b29c984ffd1107d916871', image_url: 'https://example.com/ke-sach.jpg', },
            // { name: 'Đồ trang trí', category_id: '672b29c984ffd1107d916871', image_url: 'https://example.com/ke-sach.jpg', },
            { name: 'Khác', category_id: '672b29c984ffd1107d916871', image_url: 'https://example.com/ke-sach.jpg', },

            // Dụng cụ bếp
            // { name: 'Nồi inox', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/noi-inox.jpg' },
            // { name: 'Chảo chống dính', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/chao-chong-dinh.jpg' },
            // { name: 'Bộ dao', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/bo-dao.jpg' },
            // { name: 'Thớt', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/thot.jpg' },
            // { name: 'Bộ nồi chảo', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/bo-noi-chao.jpg' },
            // { name: 'Đũa', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/dua.jpg' },
            // { name: 'Chén', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/chen.jpg' },
            // { name: 'Dĩa', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/dia.jpg' },
            // { name: 'Bộ bát', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/bo-bat.jpg' },
            // { name: 'Ly thủy tinh', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/ly-thuy-tinh.jpg' },
            // { name: 'Thau rổ', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/thau-ro.jpg' },
            { name: 'Khác', category_id: '674c2cae063edd0f6e1dff0b', image_url: 'https://example.com/thau-ro.jpg' },
            
            // Danh mục "Quần áo"
            // { name: 'Áo thun', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/ao-thun.jpg' },
            // { name: 'Quần jeans', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/quan-jeans.jpg' },
            // { name: 'Váy', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/vay.jpg' },
            // { name: 'Áo khoác', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/ao-khoac.jpg' },
            // { name: 'Sơ mi', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/so-mi.jpg' },
            // { name: 'Quần short', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/quan-short.jpg' },
            // { name: 'Đầm maxi', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/dam-maxi.jpg' },
            // { name: 'Áo len', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/ao-len.jpg' },
            // { name: 'Quần dài', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/ao-len.jpg' },
            // { name: 'Vest', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/ao-len.jpg' },
            { name: 'Khác', category_id: '67605b4fc24a8ca151b055d6', image_url: 'https://example.com/ao-len.jpg' },

            // Danh mục "Đồ điện tử"
            // { name: 'Điện thoại di động', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/dien-thoai.jpg' },
            // { name: 'Laptop', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/laptop.jpg' },
            // { name: 'Máy ảnh', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/may-anh.jpg' },
            // { name: 'Loa bluetooth', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/loa-bluetooth.jpg' },
            // { name: 'Smartwatch', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/smartwatch.jpg' },
            // { name: 'Tai nghe', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/tai-nghe.jpg' },
            // { name: 'Máy chiếu', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/may-chieu.jpg' },
            // { name: 'Thiết bị chơi game', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/may-chieu.jpg' },
            // { name: 'Thiết bị giải trí', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/may-chieu.jpg' },
            { name: 'Khác', category_id: '67605f7bc24a8ca151b055d7', image_url: 'https://example.com/may-chieu.jpg' },

            // Danh mục "Đồ dùng cá nhân"
            // { name: 'Đồng hồ', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/dong-ho.jpg' },
            // { name: 'Sữa rửa mặt', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/sua-rua-mat.jpg' },
            // { name: 'Kem chống nắng', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/kem-chong-nang.jpg' },
            // { name: 'Son môi', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/son-moi.jpg' },
            // { name: 'Nước hoa', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/nuoc-hoa.jpg' },
            // { name: 'Bàn chải đánh răng', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/ban-chai.jpg' },
            // { name: 'Khăn tắm', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/khan-tam.jpg' },
            // { name: 'Đồ thủ công', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/khan-tam.jpg' },
            // { name: 'Dụng cụ nhạc', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/khan-tam.jpg' },
            // { name: 'Nón bảo hiểm', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/khan-tam.jpg' },
            // { name: 'Sách', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/khan-tam.jpg' },
            // { name: 'Dụng cụ giải trí', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/khan-tam.jpg' },
            // { name: 'Dụng cụ hỗ trợ sức khoẻ', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/khan-tam.jpg' },
            { name: 'Khác', category_id: '676ad8f877f31359ae29761d', image_url: 'https://example.com/khan-tam.jpg' },


            // Danh mục "Đồ dùng văn phòng"
            // { name: 'Bút bi', category_id: '676c315125a38eb0a1bc8787', image_url: 'https://example.com/but-bi.jpg' },
            // { name: 'Giấy A4', category_id: '676c315125a38eb0a1bc8787', image_url: 'https://example.com/giay-a4.jpg' },
            // { name: 'Máy in', category_id: '676c315125a38eb0a1bc8787', image_url: 'https://example.com/may-in.jpg' },
            // { name: 'Bảng trắng', category_id: '676c315125a38eb0a1bc8787', image_url: 'https://example.com/bang-trang.jpg' },
            // { name: 'Kẹp giấy', category_id: '676c315125a38eb0a1bc8787', image_url: 'https://example.com/keo-giay.jpg' },
            // { name: 'Bìa hồ sơ', category_id: '676c315125a38eb0a1bc8787', image_url: 'https://example.com/bia-ho-so.jpg' },
            // { name: 'Bảng ghi nhớ', category_id: '676c315125a38eb0a1bc8787', image_url: 'https://example.com/bang-ghi-nho.jpg' },
            { name: 'Khác', category_id: '676c315125a38eb0a1bc8787', image_url: 'https://example.com/bang-ghi-nho.jpg' },
        ];

        // Tạo và lưu tất cả danh mục chi tiết vào cơ sở dữ liệu
        const createdCategoryDetails = await CategoryDetails.create(categoryDetailsData);
        console.log('Category details added successfully:', createdCategoryDetails);
    } catch (error) {
        console.error('Error adding category details:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// Uncomment dòng dưới để chạy hàm
// addCategoryDetails();

export default addCategoryDetails;

//{category_id: "676ad8f877f31359ae29761d", subcategory_name: { $exists: false }}