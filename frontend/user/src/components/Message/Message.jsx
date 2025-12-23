import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import ListMessage from './ListMessage';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { IP } from '../../config';

const socket = io(`http://localhost:5555`);

const Message = () => {
    const { userId, conversationId } = useParams(); // Lấy userId và conversationId từ URL
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // useEffect(() => {
    //     if (conversationId) { // Nếu có conversationId thì fetch thông tin cuộc hội thoại
    //         const fetchConversation = async () => {
    //             try {
    //                 const response = await axios.get(`http://${IP}:5555/conversations/byId/${conversationId}`);
    //                 setSelectedConversation(response.data);
                    
    //                 // Gọi API để lấy thông tin người dùng
    //                 const userResponse = await axios.get(`http://${IP}:5555/users/${response.data.participant1 === userId ? response.data.participant2 : response.data.participant1}`);
    //                 setSelectedUser(userResponse.data); // Cập nhật thông tin người dùng
    //             } catch (error) {
    //                 console.error('Error fetching conversation or user:', error);
    //             }
    //         };

    //         fetchConversation();
    //         socket.on("newMessage", fetchConversation); // Thêm listener cho tin nhắn mới

    //         // Cleanup listener khi component bị hủy
    //         return () => {
    //             socket.off("newMessage", fetchConversation);
    //         };
    //     }
    // }, [conversationId, userId]);

    // const handleSelectConversation = ({ conversation, user }) => {
    //     setSelectedConversation(conversation);
    //     setSelectedUser(user);
    // };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <ListMessage /> 
            <Chat/> {/* Truyền user vào Chat */}
        </div>
    );
};

//userId={userId} onClick={() => handleSelectConversation({selectedConversation, selectedUser})} 
//conversation={selectedConversation} user={selectedUser}

export default Message;