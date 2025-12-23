import mongoose from "mongoose";

const productViewSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    view_product: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductViews = mongoose.model("ProductViews", productViewSchema);
export default ProductViews;
