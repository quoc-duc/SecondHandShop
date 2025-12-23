import dotenv from "dotenv";

dotenv.config(); // Tải biến môi trường từ tệp .env

export const PORT = process.env.PORT || 5555;
export const mongodbconn = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET || "defaultsecretkey";
export const IP = "192.168.2.243" || "localhost";
//192.168.1.248
