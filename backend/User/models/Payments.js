import mongoose from "mongoose";

// Định nghĩa schema cho Payment
const paymentSchema = new mongoose.Schema(
  {
    // payment_id: {
    //     type: String,
    //     required: true,
    //     unique: true, // Đảm bảo payment_id là duy nhất
    // },
    type: {
      type: String,
      required: true,
      enum: ["Pay Online", "Cash"], // Các loại thanh toán có thể
    },
    order_id: {
      type: String,
      required: true,
    },
    user_id_pay: {
      type: String,
      required: false,
    },
    user_id_receive: {
      type: String,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
    },
    status_payment: {
      type: String,
      required: true,
      enum: ["Pending", "Đã thanh toán", "Failed"],
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo model từ schema
const Payments = mongoose.model("Payments", paymentSchema);

export default Payments;
