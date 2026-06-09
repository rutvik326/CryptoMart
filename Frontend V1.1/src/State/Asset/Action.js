import api from '../../config/api';
import {
    GET_ASSET_REQUEST,
    GET_ASSET_SUCCESS,
    GET_ASSET_FAILURE,
    GET_USER_ASSETS_REQUEST,
    GET_USER_ASSETS_SUCCESS,
    GET_USER_ASSETS_FAILURE
} from './ActionTypes';

// Fetch details of a specific asset (coin) the user owns
export const getAssetDetails = ({ coinId, jwt }) => async (dispatch) => {
    dispatch({ type: GET_ASSET_REQUEST });

    try {
        const response = await api.get(`/api/asset/${coinId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        dispatch({
            type: GET_ASSET_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: GET_ASSET_FAILURE,
            payload: error.message,
        });
    }
};

// Fetch all assets (portfolio) for the logged-in user
export const getUserAssets = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_ASSETS_REQUEST });

    try {
        const response = await api.get('/api/asset', {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        dispatch({
            type: GET_USER_ASSETS_SUCCESS,
            payload: response.data,
        });
        console.log("User Assets:", response.data);
    } catch (error) {
        dispatch({
            type: GET_USER_ASSETS_FAILURE,
            payload: error.message,
        });
    }
};