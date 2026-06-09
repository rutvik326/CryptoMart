import {
    GET_ASSET_REQUEST,
    GET_ASSET_SUCCESS,
    GET_ASSET_FAILURE,
    GET_USER_ASSETS_REQUEST,
    GET_USER_ASSETS_SUCCESS,
    GET_USER_ASSETS_FAILURE
} from './ActionTypes';

const initialState = {
    asset: null,       // Stores details of a single asset (optional, for specific views)
    userAssets: [],    // Stores the user's entire portfolio (Crucial for TradingForm)
    loading: false,
    error: null,
};

export const assetReducer = (state = initialState, action) => {
    switch (action.type) {
        // --- REQUEST CASES ---
        case GET_ASSET_REQUEST:
        case GET_USER_ASSETS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        // --- SUCCESS CASES ---
        
        // Updates the single asset details
        case GET_ASSET_SUCCESS:
            return {
                ...state,
                asset: action.payload,
                loading: false,
                error: null,
            };

        // Updates the user's portfolio list
        case GET_USER_ASSETS_SUCCESS:
            return {
                ...state,
                userAssets: action.payload,
                loading: false,
                error: null,
            };

        // --- FAILURE CASES ---
        case GET_ASSET_FAILURE:
        case GET_USER_ASSETS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};