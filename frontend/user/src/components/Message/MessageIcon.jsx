import React, { useState, useEffect } from "react";
import { FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import io from 'socket.io-client';
import { IP } from "../../config";

const socket = io(`http://localhost:5555`);

const MessageIcon = () => {
    const userInfoString = sessionStorage.getItem('userInfo');
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    const [unread, setUnread] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            fetchConversations();
            socket.on("newMessage", fetchConversations);

            // Cleanup listener khi component bị hủy
            return () => {
                socket.off("newMessage", fetchConversations);
            };
        }
    }, [userInfo]);

    const unReadMess = async (idConver, user) => {
        try {
            const response = await axios.get(`http://${IP}:5555/messages/${idConver}`);
            const messages = response.data;

            const count = messages.reduce((acc, mess) => {
                return (mess.statusMessage === 'sent' && mess.senderId !== user) ? acc + 1 : acc;
            }, 0);

            return count;
        } catch (error) {
            console.error(`Error fetching messages for conversation ${idConver}:`, error);
            return 0; // Trả về 0 nếu có lỗi
        }
    };

    const fetchConversations = async () => {
        try {
            const response = await axios.get(`http://${IP}:5555/conversations/${userInfo._id}`);
            const conversa = await Promise.all(response.data.map(async (conversation) => {
                const unRead = await unReadMess(conversation._id, userInfo._id);
                return {
                    ...conversation,
                    unRead
                };
            }));

            setUnread(conversa.reduce((acc, conversation) => acc + conversation.unRead, 0));
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    return (
        <span className="relative cursor-pointer" onClick={() => navigate(`/message/${userInfo._id}`)} title="Trò chuyện">
            <FiMessageCircle className="h-5 w-5" />
            {userInfo && unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1">
                    {unread}
                </span>
            )}
        </span>
    );
}

export default MessageIcon;