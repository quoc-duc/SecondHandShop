import mongoose from 'mongoose';

// Định nghĩa schema cho Regulations
const regulationSchema = new mongoose.Schema({
    // regulation_id: {
    //     type: String,
    //     required: true,
    //     unique: true,
    // },
    user_id_create:{
        type: String,
        require: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
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

const Regulations = mongoose.model('Regulations', regulationSchema);

export default Regulations;