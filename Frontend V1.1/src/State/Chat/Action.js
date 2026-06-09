import api from '../../config/api';
import { 
    CHAT_BOT_REQUEST, 
    CHAT_BOT_SUCCESS, 
    CHAT_BOT_FAILURE 
} from './ActionTypes';

export const sendMessageToChatBot = ({ prompt, jwt }) => async (dispatch) => {
    dispatch({ type: CHAT_BOT_REQUEST });

    try {
        const response = await api.post('/api/chat', 
            { prompt }, // Request Body
            {
                headers: { Authorization: `Bearer ${jwt}` },
            }
        );

        dispatch({
            type: CHAT_BOT_SUCCESS,
            payload: response.data, // Expecting { message: "AI response..." }
        });
        console.log("ChatBot Response:", response.data);
    } catch (error) {
        dispatch({
            type: CHAT_BOT_FAILURE,
            payload: error.message,
        });
        console.log("ChatBot Error:", error);
    }
};