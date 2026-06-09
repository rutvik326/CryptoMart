import { 
    CHAT_BOT_REQUEST, 
    CHAT_BOT_SUCCESS, 
    CHAT_BOT_FAILURE 
} from './ActionTypes';

const initialState = {
    message: null,
    loading: false,
    error: null,
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case CHAT_BOT_REQUEST:
            return { ...state, loading: true, error: null, message: null };

        case CHAT_BOT_SUCCESS:
            return { 
                ...state, 
                message: action.payload.message, 
                loading: false, 
                error: null 
            };

        case CHAT_BOT_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default chatReducer;