import mongoose from 'mongoose';
import Users from '../models/Users.js';
import bcrypt from 'bcrypt';

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addUsers = async () => {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect(mongodbconn, { useNewUrlParser: true, useUnifiedTopology: true });

    // Dữ liệu người dùng
    const usersData = [
      {
        // user_id: 'user001',
        email: 'user1@example.com',
        username: 'user1',
        password: 'password123', // Mật khẩu gốc
        name: 'User One',
        address: '123 Main St',
        phone: 1234567890,
        avatar_url: 'https://example.com/avatar1.png',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        status: true,
      },
      {
        // user_id: 'user002',
        email: 'user2@example.com',
        username: 'user2',
        password: 'password456', // Mật khẩu gốc
        name: 'User Two',
        address: '456 Elm St',
        phone: 9876543210,
        avatar_url: 'https://example.com/avatar2.png',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date(),
        status: true,
      },
    ];

    // Mã hóa mật khẩu cho từng người dùng
    for (const user of usersData) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    // Tạo và lưu tất cả người dùng vào cơ sở dữ liệu
    const createdUsers = await Users.create(usersData);

    console.log('Users added successfully:');
    // console.log(createdUsers);
  } catch (error) {
    console.error('Error adding users:', error);
  } finally {
    // Ngắt kết nối
    await mongoose.connection.close();
  }
};

//  addUsers();

export default addUsers;

// Data in cloud mongo
// {
//   "email": "user1@example.com",
//   "username": "user1",
//   "password": "password123",
//   "name": "Nguyễn Văn A",
//   "address": "123 Đường A, Quận 1, TP.HCM",
//   "phone": 123456789,
//   "avatar_url": "http://example.com/avatar1.png",
//   "role": "user"
// }

// {
//   "email": "user2@example.com",
//   "username": "user2",
//   "password": "securePassword456",
//   "name": "Trần Thị B",
//   "address": "456 Đường B, Quận 2, TP.HCM",
//   "phone": 987654321,
//   "avatar_url": "http://example.com/avatar2.png",
//   "role": "admin"
// }

// {
//   "email": "user3@example.com",
//   "username": "user3",
//   "password": "myPassword789",
//   "name": "Lê Văn C",
//   "address": "789 Đường C, Quận 3, TP.HCM",
//   "phone": 456789123,
//   "avatar_url": "http://example.com/avatar3.png",
//   "role": "user"
// }
// {
//   "email": "user123@example.com",
//   "username": "user123",
//   "password": "user123",  // Mật khẩu đã được băm
//   "name": "Nguyễn Văn A",
//   "address": "123 Đường ABC, Quận 1, TP.HCM",
//   "phone": 1234567890,
//   "avatar_url": "https://example.com/images/avatar.jpg",
//   "role": "user"
// }