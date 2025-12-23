import mongoose from "mongoose";

// Định nghĩa schema cho Carts
const cartSchema = new mongoose.Schema(
  {
    user_buyer: {
      type: String,
      required: true,
    },
    user_seller: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_imageUrl: {
      type: String,
      required: true,
    },
    product_weight: {
      type: Number,
      required: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Tạo model từ schema
const Carts = mongoose.model("Carts", cartSchema);

export default Carts;
