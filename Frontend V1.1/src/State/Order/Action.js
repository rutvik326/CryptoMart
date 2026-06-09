import api from '../../config/api';
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

export const payOrder = ({ jwt, orderData, amount }) => async (dispatch) => {
    dispatch({ type: PAY_ORDER_REQUEST });

    // --- DEBUGGING: Check what data we are actually receiving ---
    console.log("--- PAY ORDER ACTION ---");
    console.log("Received Order Data:", orderData);
    
    if (!orderData.coinId) {
        console.error("CRITICAL ERROR: coinId is missing in orderData!");
        dispatch({
            type: PAY_ORDER_FAILURE,
            payload: "Error: Coin ID is missing. Cannot place order."
        });
        return; // Stop here, do not call API
    }
    // ------------------------------------------------------------

    try {
        const response = await api.post(
            // 1. URL Parameter: Matches @PostMapping("/pay/{orderType}")
            `/api/orders/pay/${orderData.orderType}`,
            
            // 2. Body Payload: Strictly matches your CreateOrderRequest.java
            {
                coinId: orderData.coinId,                // String
                quantity: parseFloat(orderData.quantity) // Double
            },
            
            // 3. Headers
            {
                headers: { Authorization: `Bearer ${jwt}` },
            }
        );

        dispatch({
            type: PAY_ORDER_SUCCESS,
            payload: response.data,
            amount: amount 
        });
        console.log("Order Success:", response.data);
    } catch (error) {
        dispatch({
            type: PAY_ORDER_FAILURE,
            payload: error.message,
        });
        console.log("Order Failure:", error);
    }
};

export const getOrderById = (jwt, orderId) => async (dispatch) => {
    dispatch({ type: GET_ORDER_REQUEST });

    try {
        const response = await api.get(`/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });

        dispatch({
            type: GET_ORDER_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: GET_ORDER_FAILURE,
            payload: error.message,
        });
    }
};

export const getAllOrdersForUser = ({ jwt, orderType, assetSymbol }) => async (dispatch) => {
    dispatch({ type: GET_ALL_ORDERS_REQUEST });

    try {
        const response = await api.get('/api/orders', {
            headers: { Authorization: `Bearer ${jwt}` },
            params: {
                order_type: orderType,
                asset_symbol: assetSymbol
            },
        });

        dispatch({
            type: GET_ALL_ORDERS_SUCCESS,
            payload: response.data,
        });
        console.log("User Orders:", response.data);
    } catch (error) {
        dispatch({
            type: GET_ALL_ORDERS_FAILURE,
            payload: error.message,
        });
    }
};