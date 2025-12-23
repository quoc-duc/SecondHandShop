import axios from 'axios';
import { IP } from '../config';

const addConversation = async (participant1, participant2) => {
    try{
        const response = await axios.post(`http://${IP}:5555/conversations`, {participant1, participant2});
        const data = response.data;
        return data;
    }catch(error){
        console.log(error)
        alert("Có lỗi khi tạo trò chuyện: " + error)
    }
}

const addMessage = async (conversationId, content, senderId, receiverId) => {
    try{
        const response = await axios.post(`http://${IP}:5555/messages`, {conversationId, content, senderId, receiverId});
        const data = response.data;
        return data;
    }catch(error){
        console.log(error)
        alert("Có lỗi khi gửi tin nhắn: " + error)
    }
}

export {addConversation, addMessage}