import mongoose from 'mongoose';
import Countries from '../User/models/Countries.js'; // Đảm bảo đường dẫn đúng
import { mongodbconn } from "../config.js"; // Sử dụng mongodbconn từ config

const addCountries = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect('mongodb+srv://minhquan31102003:f3n9fJaQYv7YYdIa@muabandocu.8c5m9.mongodb.net/?retryWrites=true&w=majority&appName=MuaBanDoCu');

        // Dữ liệu các quốc gia
        const countriesData = [
            { name: 'Việt Nam' },
            { name: 'Mỹ' },
            { name: 'Canada' },
            { name: 'Úc' },
            { name: 'Đức' },
            { name: 'Pháp' },
            { name: 'Nhật Bản' },
            { name: 'Hàn Quốc' },
            { name: 'Brazil' },
            { name: 'Ấn Độ' },
            { name: 'Nga' },
            { name: 'Anh' },
            { name: 'Tây Ban Nha' },
            { name: 'Ý' },
            { name: 'Mexico' },
            { name: 'Indonesia' },
            { name: 'Thái Lan' },
            { name: 'Đài Loan' },
            { name: 'Singapore' },
            { name: 'Malaysia' },
            { name: 'Nam Phi' },
            { name: 'Nigeria' },
            { name: 'Philippines' },
            { name: 'New Zealand' },
            { name: 'Thụy Điển' },
            { name: 'Na Uy' },
            { name: 'Đan Mạch' },
            { name: 'Phần Lan' },
            { name: 'Hy Lạp' },
            { name: 'Bồ Đào Nha' },
            { name: 'Áo' },
            { name: 'Thụy Sĩ' },
            { name: 'Hungary' },
            { name: 'Séc' },
            { name: 'Slovakia' },
            { name: 'Ireland' },
            { name: 'Croatia' },
            { name: 'Serbia' },
            { name: 'Thổ Nhĩ Kỳ' },
            { name: 'Israel' },
            { name: 'Pakistan' },
            { name: 'Bangladesh' },
            { name: 'Kazakhstan' },
            { name: 'UAE' },
            { name: 'Saudi Arabia' },
            { name: 'Kuwait' },
            { name: 'Qatar' },
            { name: 'Jordan' },
            { name: 'Đảo Solomon' },
            { name: 'Fiji' },
            { name: 'Papua New Guinea' },
            { name: 'Vanuatu' },
        ];

        // Tạo và lưu tất cả quốc gia vào cơ sở dữ liệu
        const createdCountries = await Countries.create(countriesData);
        console.log('Countries added successfully:', createdCountries);
    } catch (error) {
        console.error('Error adding countries:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// Uncomment dòng dưới để chạy hàm
// addCountries();

export default addCountries;