import mongoose from 'mongoose';

const vnPayAccountSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    vnPayAccount: { 
        type: String, 
        required: true 
    },
    user_id: { 
        type: String, 
        unique: true, 
        required: true 
    },
    balance: { 
        type: Number, 
        default: 0 
    },
    
}, {
    timestamps: true,
});

const VNPayAccounts = mongoose.model('VNPayAccounts', vnPayAccountSchema);

export default VNPayAccounts;