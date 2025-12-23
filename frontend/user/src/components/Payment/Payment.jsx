import React, { useState } from 'react';
import axios from 'axios';
import { IP } from '../../config';

const PaymentForm = () => {
    const [amount, setAmount] = useState(0);
    const [orderInfo, setOrderInfo] = useState('');

    const handlePayment = async () => {
        try {
            const response = await axios.post(`http://${IP}:5555/payment/momo`, {
                amount,
                orderInfo,
            });

            if (response.data && response.data.payUrl) {
                window.location.href = response.data.payUrl; // Chuyển hướng đến Momo để thanh toán
            }
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    return (
        <div>
            <h2>Thanh Toán Momo</h2>
            <input
                type="number"
                placeholder="Số tiền"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <input
                type="text"
                placeholder="Thông tin đơn hàng"
                value={orderInfo}
                onChange={(e) => setOrderInfo(e.target.value)}
            />
            <button onClick={handlePayment}>Thanh Toán</button>
        </div>
    );
};

export default PaymentForm;