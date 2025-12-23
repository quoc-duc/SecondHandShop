import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountDetails = () => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get('/api/vnpay/account', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming you store your token in local storage
                    },
                });
                setAccount(response.data);
            } catch (err) {
                setError(err.response.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Account Details</h2>
            <p>Username: {account.username}</p>
            <p>VNPay Account: {account.vnPayAccount}</p>
            <p>Balance: {account.balance} VND</p>
        </div>
    );
};

export default AccountDetails;