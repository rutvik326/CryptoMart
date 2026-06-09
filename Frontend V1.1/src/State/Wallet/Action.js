import axios from "axios";
import * as types from "./ActionType";

const API_BASE_URL = 'http://localhost:5454';

// 1. GET USER WALLET
export const getUserWallet = (jwt) => async (dispatch) => {
    dispatch({ type: types.GET_USER_WALLET_REQUEST });
    try {
        const response = await axios.get(`${API_BASE_URL}/api/wallet`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        dispatch({ type: types.GET_USER_WALLET_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: types.GET_USER_WALLET_FAILURE, error: error.message });
    }
};

// 2. GET WALLET TRANSACTIONS
export const getWalletTransactions = ({ jwt }) => async (dispatch) => {
    dispatch({ type: types.GET_WALLET_TRANSACTION_REQUEST });
    try {
        const response = await axios.get(`${API_BASE_URL}/api/wallet/transactions`, {
            headers: { Authorization: `Bearer ${jwt}` }
        });
        dispatch({ type: types.GET_WALLET_TRANSACTION_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: types.GET_WALLET_TRANSACTION_FAILURE, error: error.message });
    }
};

// 3. DEPOSIT MONEY
export const depositMoney = ({ jwt, amount, paymentMethod }) => async (dispatch) => {
    dispatch({ type: types.DEPOSIT_MONEY_REQUEST });
    try {
        const response = await axios.put(`${API_BASE_URL}/api/wallet/deposit`, null, {
            params: { amount, paymentMethod },
            headers: { Authorization: `Bearer ${jwt}` }
        });
        dispatch({ type: types.DEPOSIT_MONEY_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: types.DEPOSIT_MONEY_FAILURE, error: error.message });
    }
};

// 4. CONFIRM DEPOSIT SUCCESS
export const depositMoneySuccess = ({ jwt, orderId, paymentId }) => async (dispatch) => {
    dispatch({ type: types.GET_USER_WALLET_REQUEST }); 
    try {
        const response = await axios.get(`${API_BASE_URL}/api/wallet/deposit/success`, {
            params: { 
                order_id: orderId,
                payment_id: paymentId || "ST_SUCCESS" 
            },
            headers: { Authorization: `Bearer ${jwt}` }
        });
        dispatch({ type: types.GET_USER_WALLET_SUCCESS, payload: response.data });
        dispatch(getWalletTransactions({ jwt }));
    } catch (error) {
        dispatch({ type: types.GET_USER_WALLET_FAILURE, error: error.message });
    }
};

// 5. TRANSFER MONEY (FIXED ENDPOINT & DATA HANDLING)
export const transferMoney = ({ jwt, walletId, reqData }) => async (dispatch) => {
    dispatch({ type: types.TRANSFER_MONEY_REQUEST });
    try {
        // Ensure walletId is a clean string/number, removing any colons or extra characters
        const cleanId = String(walletId).replace(/[:\s]/g, "");
        
        // Use the standard Spring Boot Path: /api/wallet/{walletId}/transfer
        const response = await axios.put(
            `${API_BASE_URL}/api/wallet/${cleanId}/transfer`,
            reqData, 
            { headers: { Authorization: `Bearer ${jwt}` } }
        );

        dispatch({
            type: types.TRANSFER_MONEY_SUCCESS,
            payload: response.data,
        });

        // Auto-refresh wallet balance and history
        dispatch(getUserWallet(jwt));
        dispatch(getWalletTransactions({ jwt }));

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        dispatch({
            type: types.TRANSFER_MONEY_FAILURE,
            error: errorMessage,
        });
        throw new Error(errorMessage);
    }  
};