import mongoose from 'mongoose';

// Định nghĩa schema cho Reviews
const reviewSchema = new mongoose.Schema({
    // review_id: {
    //     type: String,
    //     required: true,
    //     unique: true, // Đảm bảo review_id là duy nhất
    // },
    product_id: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
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

const Reviews = mongoose.model('Reviews', reviewSchema);

export default Reviews;