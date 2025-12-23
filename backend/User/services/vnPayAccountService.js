import VNPayAccounts from '../models/VnPayAccounts.js';
import bcrypt from 'bcrypt';

const registerUser = async (data) => {
    const { username, password, vnPayAccount, user_id } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new VNPayAccounts({
        username,
        password: hashedPassword,
        vnPayAccount,
        user_id,
    });

    return await user.save();
};

const findUserById = async (userId) => {
    return await VNPayAccounts.findById(userId);
};

const findUserByUserId = async (user_id) => {
    return await VNPayAccounts.findOne({ user_id });
};

const updateBalance = async (userId, amount) => {
    return await VNPayAccounts.findByIdAndUpdate(userId, { $inc: { balance: amount } }, { new: true });
};

const getUserDetails = async (userId) => {
    return await VNPayAccounts.findById(userId).select('username vnPayAccount balance'); // Select only necessary fields
};

export {
    registerUser,
    findUserById,
    findUserByUserId,
    updateBalance,
    getUserDetails
};