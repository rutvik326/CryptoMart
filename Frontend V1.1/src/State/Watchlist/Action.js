import api from '../../config/api';
import {
    GET_USER_WATCHLIST_REQUEST,
    GET_USER_WATCHLIST_SUCCESS,
    GET_USER_WATCHLIST_FAILURE,
    ADD_COIN_TO_WATCHLIST_REQUEST,
    ADD_COIN_TO_WATCHLIST_SUCCESS,
    ADD_COIN_TO_WATCHLIST_FAILURE,
} from './ActionTypes';

// Fetch the current user's watchlist
export const getUserWatchlist = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_WATCHLIST_REQUEST });

    try {
        const response = await api.get('/api/watchlist/user', {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        dispatch({
            type: GET_USER_WATCHLIST_SUCCESS,
            payload: response.data,
        });
        console.log("User Watchlist:", response.data);
    } catch (error) {
        console.log("Error Fetching Watchlist:", error);
        dispatch({
            type: GET_USER_WATCHLIST_FAILURE,
            // Check if backend sent a specific error message, otherwise use generic message
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message,
        });
    }
};

// Add (or Toggle) a coin to the watchlist
export const addItemToWatchlist = (coinId, jwt) => async (dispatch) => {
    dispatch({ type: ADD_COIN_TO_WATCHLIST_REQUEST });

    try {
        // --- CRITICAL FIX: Changed from .put() to .patch() ---
        // The error 405 (Method Not Allowed) happens because the backend 
        // uses @PatchMapping for this endpoint.
        const response = await api.patch(`/api/watchlist/add/coin/${coinId}`, {}, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        dispatch({
            type: ADD_COIN_TO_WATCHLIST_SUCCESS,
            payload: response.data,
        });
        console.log("Added/Removed form Watchlist:", response.data);
    } catch (error) {
        console.log("Error Adding to Watchlist:", error);
        dispatch({
            type: ADD_COIN_TO_WATCHLIST_FAILURE,
            // Check if backend sent a specific error message, otherwise use generic message
            payload: error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message,
        });
    }
};