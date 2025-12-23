import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { IP } from '../../config';
import nonAvata from "../../assets/img/nonAvata.jpg";

const socket = io(`http://localhost:5555`);

const ListMessage = () => {
    const { userId} = useParams();
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]); // Mảng để lưu thông tin người dùng
    const navigate = useNavigate();

    const [selectedConversationId, setSelectedConversationId] = useState(null);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const unReadMess = async (idConver, user) => {
        const response = await axios.get(`http://${IP}:5555/messages/${idConver}`);
        const messages = response.data; // Lấy dữ liệu tin nhắn

        // Sử dụng reduce để đếm số tin nhắn có trạng thái 'sent'
        const count = messages.reduce((acc, mess) => {
            return (mess.statusMessage === 'sent' && mess.senderId != user) ? acc + 1 : acc; // Tăng biến acc nếu trạng thái là 'sent'
        }, 0); // Khởi tạo acc với giá trị 0

        return count;
    };

    useEffect(() => {
        fetchConversations();
        const handleNewMessage = () => {
            fetchConversations();
        };
        socket.on("newMessage", handleNewMessage);
    
        // Gỡ bỏ sự kiện khi component bị hủy
        return () => {
            socket.off("newMessage", handleNewMessage);
        };
    }, [userId]);

    const fetchConversations = async () => {
            try {
                const response = await axios.get(`http://${IP}:5555/conversations/${userId}`);
                

                const conversa = await Promise.all(response.data.map(async (conversation) => {
                    const unRead = await unReadMess(conversation._id, userId); // Gọi hàm bất đồng bộ để lấy số tin nhắn chưa đọc
                    return {
                        ...conversation, // Giữ lại tất cả các trường dữ liệu gốc
                        unRead // Thêm trường unRead vào đối tượng
                    };
                }));

                setConversations(conversa);

                // Lấy thông tin người dùng cho từng cuộc hội thoại
                const participantIds = response.data.map(conversation => 
                    conversation.participant1 === userId ? conversation.participant2 : conversation.participant1
                );

                // Gọi API để lấy thông tin người dùng
                const userPromises = participantIds.map(id => axios.get(`http://${IP}:5555/users/${id}`));
                const userResponses = await Promise.all(userPromises);

                // Lưu thông tin người dùng vào mảng
                const usersData = userResponses.map(userResponse => userResponse.data);
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

    const handleSelectConversation = async (conversation) => {
        setSelectedConversationId(conversation._id); // Cập nhật ID cuộc hội thoại được chọn
        const userSend = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
        const senderId = userSend;
        const id = conversation._id;
        const aa = await axios.post(`http://${IP}:5555/messages/read/${id}`, { senderId });
        navigate(`/message/${userId}/${conversation._id}`);
    };

    return (
        <div style={{ width: '350px', borderRight: '1px solid #ccc'}}>
            {/* <h2>Danh Sách Cuộc Hội Thoại</h2> */}
            {conversations.map((conversation, index) => {
                const participantId = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
                const user = users[index]; // Lấy thông tin người dùng từ mảng

                const isSelected = conversation._id === selectedConversationId; // Kiểm tra cuộc hội thoại có được chọn không


                return (
                    <div 
                    key={conversation._id} 
                    className="conversation relative" 
                    onClick={() => handleSelectConversation(conversation)} // Gửi cuộc hội thoại khi chọn
                    style={{ 
                        cursor: 'pointer', 
                        padding: '10px', 
                        borderRight: isSelected ? '4px solid rgb(255, 188, 72)' : '1px solid #eee', // Đổi màu và độ dày border khi được chọn
                        borderLeft: isSelected ? '4px solid rgb(255, 188, 72)' : '1px solid #eee',
                        borderRadius: '30px',
                        backgroundColor: isSelected ? '#e0f7fa' : 'white', // Màu nền nổi bật nếu được chọn
                        boxShadow: isSelected ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none', // Đổ bóng nếu được chọn
                    }}
                >   
                    {user != null ? (
                        <div className="flex items-center">
                            <img src={user.avatar_url == null ? nonAvata : user.avatar_url} alt="Avatar" className='rounded-full mt-2 mb-2 ' style={{ border: '2px solid #eee', width: '50px', height: '50px' }} />
                            <div className="relative">
                                <p className="ml-2"><strong>{user.name}</strong></p>
                                <span>
                                    <p className="ml-2 truncate overflow-hidden whitespace-nowrap">{conversation.lastMessage.endsWith('.mp4') ? 
                                        "Video" : 
                                        (conversation.lastMessage.endsWith('.png') ? 
                                            "Hình ảnh"
                                            :(conversation.lastMessage.length > 20 ? 
                                                `${conversation.lastMessage.substring(0, 20)}...` : 
                                                conversation.lastMessage
                                            )) }</p>
                                    <p className="ml-2">{conversation.lastMessageTimestamp ? formatDate(conversation.lastMessageTimestamp) : 'Chưa có tin nhắn'}</p>
                                </span>
                                
                            </div>
                        </div>
                    ) : null}
                    {conversation.unRead > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
                            {conversation.unRead}
                        </span>
                    )}
                </div>
                
                );
            })}
        </div>
    );
};

export default ListMessage;