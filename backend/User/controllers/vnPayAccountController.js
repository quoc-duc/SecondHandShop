import {registerUser,
    findUserById,
    findUserByUserId,
    updateBalance,
    getUserDetails} from '../services/vnPayAccountService.js';

const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    // Implement login logic here (authentication and JWT token generation)
};

const transferMoney = async (req, res) => {
    const { senderId, receiverId, amount } = req.body;

    try {
        const sender = await findUserById(senderId);
        const receiver = await findUserById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        await updateBalance(senderId, -amount);
        await updateBalance(receiverId, amount);

        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAccountDetails = async (req, res) => {
    const userId = req.user.id; // Assuming you have user ID from JWT token

    try {
        const userDetails = await getUserDetails(userId);
        if (!userDetails) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(userDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    register,
    login,
    transferMoney,
    getAccountDetails
}