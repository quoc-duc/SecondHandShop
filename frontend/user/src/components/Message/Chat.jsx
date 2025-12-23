import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { addMessage } from '../../hooks/Message';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { IP } from '../../config';
import nonAvata from "../../assets/img/nonAvata.jpg";
import {
  FiPaperclip, // Nhập biểu tượng kẹp giấy
  FiSend 
} from "react-icons/fi";

const socket = io(`http://localhost:5555`);

const Chat = () => {
    const { userId, conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [conversation, setConversation] = useState();
    const [user, setUser] = useState();
    const [text, setText] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);

    useEffect(() => {
        fetchMessages();
        socket.on("newMessage", fetchMessages);
        return () => {
            socket.off("newMessage", fetchMessages);
        };
    }, [conversationId, userId]);

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

    const fetchMessages = async () => {
        try {
            const response1 = await axios.get(`http://${IP}:5555/conversations/byId/${conversationId}`);
            const conversationData = response1.data;
            setConversation(conversationData);

            const u = userId === conversationData.participant1 ? conversationData.participant2 : conversationData.participant1;

            const response = await axios.get(`http://${IP}:5555/messages/${conversationData._id}`);
            setMessages(response.data);

            const response2 = await axios.get(`http://${IP}:5555/users/${u}`);
            setUser(response2.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        let content = text.trim();

        if (media) {
            const formData = new FormData();
            formData.append("file", media);
            formData.append("upload_preset", "images_preset");
            formData.append("cloud_name", "dd6pnq2is");

            const uploadUrl = media.type.startsWith('image/')
                ? 'https://api.cloudinary.com/v1_1/dd6pnq2is/image/upload'
                : 'https://api.cloudinary.com/v1_1/dd6pnq2is/video/upload';

            try {
                const response = await fetch(uploadUrl, {
                    method: "POST",
                    body: formData
                });
                const uploadedMediaUrl = await response.json();
                content = uploadedMediaUrl.secure_url;
            } catch (error) {
                console.error('Error uploading media:', error);
                return;
            }
        }

        if (content) {
            const conversationId = conversation._id;
            let senderId, receiverId;

            if (conversation.participant1 === userId) {
                senderId = conversation.participant1;
                receiverId = conversation.participant2;
            } else {
                senderId = conversation.participant2;
                receiverId = conversation.participant1;
            }

            await addMessage(conversationId, content, senderId, receiverId);
            socket.emit("sendMessage", { conversationId, content, senderId, receiverId });
            setText('');
            setMedia(null);
            setMediaPreview(null); // Reset tệp đã chọn
        }
    };

    const handleMediaChange = (e) => {
        const selectedMedia = e.target.files[0];
        setMedia(selectedMedia);
        
        if (selectedMedia) {
            const url = URL.createObjectURL(selectedMedia);
            setMediaPreview(url);
        }
    };

    return (
    <div className='w-full bg-main'>
        {user != null ? (
            <div className="flex items-center bg-#e0f7fa">
                <img src={user.avatar_url == null ? nonAvata : user.avatar_url} alt="Avatar" className=' ml-5 mt-2 mb-2 ' style={{ width: '50px', height: '50px' }} />
                {/* <p className="ml-3 text-xl font-bold">{user.name}</p> */}
                <h1 className="text-xl font-bold flex items-center bg-yellow-400 rounded-br-full rounded-tr-full">
                    <span className='m-3'>{user.name}</span>
                </h1>
            </div>
        ) : null}
        <div className='bg-white h-[70%] overflow-y-auto' style={{ padding: '0px', flexGrow: 1 }}>
            {conversation && userId ? (
                <>
                    {messages.map((message) => (
                        <div key={message._id} style={{ margin: '0px 0', padding: '0px', borderRadius: '5px' }}>
                            {userId === message.senderId ? (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '5px' }}>
                                    <div style={{
                                        backgroundColor: '#dcf8c6',
                                        padding: '10px',
                                        borderRadius: '10px',
                                        maxWidth: '75%',
                                        wordWrap: 'break-word',
                                        marginLeft: 'auto'
                                    }}>
                                        {message.content.startsWith('http') ? (
                                            message.content.endsWith('.mp4') ? (
                                                <video controls style={{ maxWidth: '100%' }}>
                                                    <source src={message.content} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <img src={message.content} alt="Uploaded" style={{ maxWidth: '100%' }} />
                                            )
                                        ) : (
                                            <p style={{ margin: 0 }}> {message.content}</p>
                                        )}
                                        <p style={{ margin: '0px 0 0' }}><small>{formatDate(message.createdAt)}</small></p>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '5px' }}>
                                    <div style={{
                                        backgroundColor: '#dcf8c6',
                                        padding: '8px',
                                        borderRadius: '10px',
                                        maxWidth: '75%',
                                        wordWrap: 'break-word',
                                        marginRight: 'auto'
                                    }}>
                                        {user != null ? (
                                            <>
                                                {message.content.startsWith('http') ? (
                                                    message.content.endsWith('.mp4') ? (
                                                        <video controls style={{ maxWidth: '100%' }}>
                                                            <source src={message.content} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : (
                                                        <img src={message.content} alt="Uploaded" style={{ maxWidth: '100%' }} />
                                                    )
                                                ) : (
                                                    <p style={{ margin: 0 }}>{message.content}</p>
                                                )}
                                                <p style={{ margin: '5px 0 0' }}><small>{formatDate(message.createdAt)}</small></p>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </>
            ) : (
                <p>Chọn một cuộc hội thoại để xem tin nhắn.</p>
            )}
        </div>
        {conversation && userId && ( // Chỉ hiển thị phần gửi tin nhắn nếu có cuộc hội thoại
            <div className='h-[25%]' >
                <div className='bg-white flex w-full items-center p-2 border-t-4 border-t-yellow-400'>
                    <label className="cursor-pointer" title="Đính kèm">
                        <FiPaperclip className="h-6 w-6 text-gray-600" /> {/* Biểu tượng kẹp giấy */}
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleMediaChange}
                            className="hidden" // Ẩn input thực tế
                        />
                    </label>
                    {mediaPreview && (
                        <div className="flex items-center ml-2">
                            {media && media.type.startsWith('video/') ? ( // Kiểm tra kiểu tệp
                                <video controls style={{ maxWidth: '100px', maxHeight: '50px', marginRight: '10px' }}>
                                    <source src={mediaPreview} type={media.type} />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img src={mediaPreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '50px', marginRight: '10px' }} />
                            )}
                            <button onClick={() => {
                                setMedia(null);
                                setMediaPreview(null);
                            }} className="text-white font-bold bg-red-500 rounded-full hover:bg-red-300">
                                    <span className="m-2 rounded-full">Xoá</span>
                                </button>
                        </div>
                    )}
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="mt-1 rounded-full block w-full border-2 border-gray-300 p-2 ml-2"
                        required
                    />
                    <button
                        onClick={handleSend}
                        style={{ border: '2px solid #eee', width: '100px', height: '50px' }}
                        className='bg-yellow-400 text-white font-bold hover:bg-yellow-500 rounded-full border border-black mt-1 ml-2 flex items-center justify-center'
                    >
                        <FiSend className="h-5 w-5 font-bold" /> {/* Biểu tượng gửi */}
                        Gửi
                    </button>
                </div>
            </div>
        )}
    </div>
    );
};

export default Chat;