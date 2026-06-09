import {
    GET_USER_WATCHLIST_REQUEST,
    GET_USER_WATCHLIST_SUCCESS,
    GET_USER_WATCHLIST_FAILURE,
    ADD_COIN_TO_WATCHLIST_REQUEST,
    ADD_COIN_TO_WATCHLIST_SUCCESS,
    ADD_COIN_TO_WATCHLIST_FAILURE,
} from './ActionTypes';

const initialState = {
    userWatchlist: null,
    loading: false,
    error: null,
    items: [], // Stores the array of coins for easy access
};

const watchlistReducer = (state = initialState, action) => {
    switch (action.type) {
        
        // --- REQUEST CASES ---
        case GET_USER_WATCHLIST_REQUEST:
        case ADD_COIN_TO_WATCHLIST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        // --- SUCCESS CASES ---
        case GET_USER_WATCHLIST_SUCCESS:
            return {
                ...state,
                userWatchlist: action.payload,
                items: action.payload.coins, // Assuming backend returns { coins: [...] }
                loading: false,
                error: null,
            };

        case ADD_COIN_TO_WATCHLIST_SUCCESS:
            return {
                ...state,
                userWatchlist: action.payload, // The updated watchlist object
                items: action.payload.coins,   // The updated list of coins
                loading: false,
                error: null,
            };

        // --- FAILURE CASES ---
        case GET_USER_WATCHLIST_FAILURE:
        case ADD_COIN_TO_WATCHLIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default watchlistReducer;