import express from 'express';
import axios from 'axios';
import crypto from 'crypto';

const paymentRoutes = express.Router();

const partnerCode = 'MOMO';
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';

paymentRoutes.post('/momo', async (req, res) => {
    const { amount, orderInfo, orderId } = req.body;

    // const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const redirectUrl = 'http://localhost:5173/';
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const requestType = 'payWithMethod';
    const extraData = '';
    const autoCapture = true;
    const lang = 'vi';

    // Tạo chữ ký
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId: orderId, // Hoặc một ID khác bạn muốn
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        lang,
        requestType,
        autoCapture,
        extraData,
        signature,
    });

    try {
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
        });

        return res.json(response.data); // Trả về dữ liệu từ Momo, bao gồm payUrl
    } catch (error) {
        console.error('Payment error:', error);
        return res.status(500).json({ message: 'Payment failed', error });
    }
});

export default paymentRoutes;