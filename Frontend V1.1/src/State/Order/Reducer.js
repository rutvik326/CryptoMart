import {
    PAY_ORDER_REQUEST,
    PAY_ORDER_SUCCESS,
    PAY_ORDER_FAILURE,
    GET_ORDER_REQUEST,
    GET_ORDER_SUCCESS,
    GET_ORDER_FAILURE,
    GET_ALL_ORDERS_REQUEST,
    GET_ALL_ORDERS_SUCCESS,
    GET_ALL_ORDERS_FAILURE
} from './ActionTypes';

const initialState = {
    orders: [],       // Stores the list of all user orders (history)
    order: null,      // Stores the details of a single order (current transaction)
    loading: false,   // Loading state for UI spinners
    error: null,      // Stores error messages if API calls fail
};

export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        // --- REQUEST CASES (Start Loading) ---
        case PAY_ORDER_REQUEST:
        case GET_ORDER_REQUEST:
        case GET_ALL_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        // --- SUCCESS CASES ---
        
        // When an order is successfully paid/created
        case PAY_ORDER_SUCCESS:
        case GET_ORDER_SUCCESS:
            return {
                ...state,
                order: action.payload,
                loading: false,
                error: null,
            };

        // When fetching the full list of orders
        case GET_ALL_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.payload,
                loading: false,
                error: null,
            };

        // --- FAILURE CASES ---
        case PAY_ORDER_FAILURE:
        case GET_ORDER_FAILURE:
        case GET_ALL_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};