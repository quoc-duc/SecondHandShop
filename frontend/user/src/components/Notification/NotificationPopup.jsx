import React from 'react';
import { updateNotification } from '../../hooks/Notifications';
import io from 'socket.io-client';
import { IP } from '../../config';
import { FiX } from 'react-icons/fi';

const socket = io(`http://localhost:5555`);

const NotificationPopup = ({ notifications, onClose }) => {

    const handleRead = async (id) => { 
        const readed = true;
        await updateNotification(id, readed);
        socket.emit('sendNotification');
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg p-4 z-50">
            <div className="flex justify-between">
                <h3 className="font-bold mb-2">Thông Báo</h3>
                <button onClick={onClose} className="font-semibold text-lg rounded-full border-2 border-red-500 h-6 w-6 text-red-500 font-bold hover hover:bg-gray-300" title='Đóng thông báo'>
                    <FiX className="inline-block mb-3.5" />
                    {/* Đóng */}
                </button>
            </div>
            {notifications.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((notification) => (
                        <li
                            onClick={() => handleRead(notification._id)}
                            key={notification._id}
                            className={`border-b-2 border-yellow-300 py-1 cursor-pointer ${!notification.readed ? 'font-bold' : 'font-normal'}`} 
                        >
                            {notification.message}<br/>
                            <span className="text-gray-500 text-sm">{formatDate(notification.createdAt)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Không có thông báo nào.</p>
            )}
        </div>
    );
};

export default NotificationPopup;