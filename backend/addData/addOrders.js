import mongoose, { ObjectId } from 'mongoose';
import Orders from '../User/models/Orders.js'; // Đảm bảo đường dẫn đúng

const mongodbconn = process.env.MONGODB_URI || 'mongodb://localhost:27017/MuaBanDoCu';

const addOrders = async () => {
    try {
        // Kết nối đến MongoDB
        await mongoose.connect('mongodb+srv://minhquan31102003:f3n9fJaQYv7YYdIa@muabandocu.8c5m9.mongodb.net/?retryWrites=true&w=majority&appName=MuaBanDoCu');

        // Dữ liệu đơn hàng
        const ordersData = [
            {
                // order_id: 'order001',
                user_id_buyer: '671e7157dde710f9657f7c1b',
                user_id_seller: '671e7157dde710f9657f7c1c',
                name: 'John Doe',
                phone: '123456789',
                address: '123 Main St, Anytown, USA',
                total_amount: 59.99,
                status_order: 'Pending',
                note: 'Please deliver by tomorrow.',
                status: true,
            },
            {
                // order_id: 'order002',
                user_id_buyer: '671e7157dde710f9657f7c1c',
                user_id_seller: '671e7157dde710f9657f7c1b',
                name: 'Jane Smith',
                phone: '987654321',
                address: '456 Elm St, Othertown, USA',
                total_amount: 89.99,
                status_order: 'Confirmed',
                note: 'Leave at the front door.',
                status: true,
            },
        ];

        // Tạo và lưu tất cả đơn hàng vào cơ sở dữ liệu
        // const createdOrders = await Orders.create(ordersData);
        
        const idsToDelete = [
    "674c3ea63dc89f563163f77e",
    "674f2f66148a5289482908af",
    "6751398608ce1f0060d1c1a3",
    "6753b92df854a80fd66a7749",
    "6753b96af854a80fd66a7756",
    "6753b9c8f854a80fd66a7763",
    "6753c22f5e73cda8496a7ff8",
    "6753c2ed5e73cda8496a8005",
    "6753c3765e73cda8496a8012",
    "6753c39d5e73cda8496a801f",
    "6753c5495e73cda8496a802e",
    "67555e1e9ef3893c0ef1f601",
    "675655e4e0a2306c3d839177",
    "6756b8b7889e34ba1e6d31ba",
    "6756c16b3a307da496253740",
    "6756c5c33a307da496253fe4",
    "6756ef527b7f25b435e27b8b",
    "6756f1c67b7f25b435e27b97",
    "6756f1c97b7f25b435e27b9d",
    "6756f1d47b7f25b435e27ba7",
    "6756f8697b7f25b435e27cd6",
    "6756f8c17b7f25b435e27ce2",
    "6756f8cd7b7f25b435e27cec",
    "6757fa0b46cf9acd7690a405",
    "6758011f46cf9acd7690a45c",
    "675802c51008d49c78543e88",
    "6758066a1008d49c78543ef5",
    "67580b401008d49c78543f69",
    "675b010567eee96688cfeada",
    "675b015d67eee96688cfeb19",
    "675b01d367eee96688cfeb5e",
    "675b036a67eee96688cfeba4",
    "675b07c957ae7cc758d078a4",
    "67603e028859ded2156d28ff",
    "67603e818859ded2156d292c",
    "67618631518fcb1c31ee14d5",
    "6761ad28518fcb1c31ee1a25",
    "676268ac978647d84488448e",
    "67626a31978647d84488465c",
    "6767e9bb8e40eef976457efa",
    "6767ea068e40eef976458950",
    "676c480ec662e3e69fef59fc",
    "676c4941c662e3e69fef5df9",
    "676cc9af7b28fd7c6a9915e0",
    "676cc9fe7b28fd7c6a99168f",
    "67e1926b7c35473de795e5e8",
    "67e194af7c35473de795e633"
];

for (const id of idsToDelete) {
            const createdOrder = await Orders.deleteOne({ _id: id });
            console.log(`Deleted order with ID: ${id}`, createdOrder);
        }
        console.log('Orders added successfully:');
        // console.log(createdOrders);
    } catch (error) {
        console.error('Error adding orders:', error);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
};

// addOrders();

export default addOrders;