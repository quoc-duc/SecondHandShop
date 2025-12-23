import axios from "axios";
import { IP } from "../config";

const getAllRegulation = async () =>{
    try{
        const regulation = await axios.get(`http://${IP}:5555/regulations`);
        return regulation.data
    }catch(err){
        console.error('Error get regulation:', err);
        throw err;
    }
}

export {getAllRegulation}