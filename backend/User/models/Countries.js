import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Đảm bảo mỗi tên quốc gia là duy nhất
    },
    status: {
      type: Boolean,
      default: true, // Trạng thái hoạt động
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Countries = mongoose.model("Countries", countrySchema);

export default Countries;