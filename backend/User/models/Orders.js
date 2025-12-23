import mongoose from "mongoose";

// Định nghĩa schema cho Orders
const orderSchema = new mongoose.Schema(
  {
    // order_id: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    user_id_buyer: {
      type: String,
      required: false,
      default: "",
    },
    user_id_seller: {
      type: String,
      required: false,
      default: "",
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    provinceId: {
      type: String,
      require: false,
    },
    districtId: {
      type: String,
      require: false,
    },
    address: {
      type: String,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    shipping_method: {
      type: String,
      required: false,
      default: "",
    },
    shipping_cost: {
      type: Number,
      required: false,
      default: 0,
    },
    status_order: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packaged",
        "Shipping",
        "Success",
        "Received",
        "Request Cancel",
        "Cancelled",
        "Received",
      ],
      default: "Pending",
    },
    payment_method: {
      type: String,
      enum: ["cash", "onlinepay"],
      default: "cash",
    },
    payment_status: {
      type: String,
      enum: ["awaiting_payment", "paid", "released_to_seller"],
      default: "awaiting_payment",
    },
    note: {
      type: String,
      default: "",
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

const Orders = mongoose.model("Orders", orderSchema);

export default Orders;
