import mongoose from 'mongoose';

// Định nghĩa schema cho OrderDetail
const orderDetailSchema = new mongoose.Schema({
    // order_detail_id: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    order_id: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true,
    },
}, {
    timestamps: true,
});

const OrderDetails = mongoose.model('OrderDetails', orderDetailSchema);

export default OrderDetails;