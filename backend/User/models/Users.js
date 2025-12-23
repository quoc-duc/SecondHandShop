import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userChema = mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      require: false,
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
      require: false,
    },
    phone: {
      type: String,
      require: false,
    },
    avatar_url: {
      type: String,
      require: false,
    },
    role: {
      type: String,
      default: "user",
    },
    ban: {
      type: Boolean,
      default: false,
    },
    qrPayment: {
      type: String,
      require: false,
    },
    bankName: {
      type: String,
      required: false,
    },
    cardHolderName: {
      type: String,
      required: false,
    },
    accountNumber: {
      type: String,
      required: false,
    },
    // created_at:{
    //     type: Date,
    //     require: true
    // },
    // updated_at:{
    //     type: Date,
    //     require: true
    // },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userChema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const Users = mongoose.model("Users", userChema);
export default Users;
