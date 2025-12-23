import mongoose from 'mongoose';

const categoryDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category_id: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

const CategoryDetails = mongoose.model('CategoryDetails', categoryDetailSchema);
export default CategoryDetails;