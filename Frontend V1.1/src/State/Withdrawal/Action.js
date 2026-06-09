import axios from "axios";
import * as types from "./ActionType";

const API_BASE_URL = 'http://localhost:5454';

/**
 * 1. REQUEST WITHDRAWAL
 */
export const withdrawalRequest = ({ jwt, amount }) => async (dispatch) => {
    dispatch({ type: types.WITHDRAW_MONEY_REQUEST });
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/withdrawal/${amount}`,
            null,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        dispatch({
            type: types.WITHDRAW_MONEY_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: types.WITHDRAW_MONEY_FAILURE,
            payload: error.response?.data?.message || error.message,
        });
    }
};

/**
 * 2. ADD PAYMENT DETAILS (Initial Creation)
 */
export const addPaymentDetails = ({ jwt, paymentDetails }) => async (dispatch) => {
    dispatch({ type: types.ADD_PAYMENT_DETAILS_REQUEST });
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/payment-details`,
            paymentDetails,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        dispatch({
            type: types.ADD_PAYMENT_DETAILS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: types.ADD_PAYMENT_DETAILS_FAILURE,
            payload: error.response?.data?.message || error.message,
        });
    }
};

/**
 * 3. UPDATE PAYMENT DETAILS (Modify Existing)
 * Using PATCH/PUT to avoid 500 duplicate errors
 */
export const updatePaymentDetails = ({ jwt, paymentDetails }) => async (dispatch) => {
    dispatch({ type: types.UPDATE_PAYMENT_DETAILS_REQUEST }); 
    try {
        // Switching to PATCH as it's standard for partial updates
        const response = await axios.patch(
            `${API_BASE_URL}/api/payment-details`,
            paymentDetails,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );

        dispatch({
            type: types.UPDATE_PAYMENT_DETAILS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: types.UPDATE_PAYMENT_DETAILS_FAILURE,
            payload: error.response?.data?.message || error.message,
        });
    }
};

/**
 * 4. GET PAYMENT DETAILS
 */
export const getPaymentDetails = ({ jwt }) => async (dispatch) => {
    dispatch({ type: types.GET_PAYMENT_DETAILS_REQUEST });
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/payment-details`,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        dispatch({
            type: types.GET_PAYMENT_DETAILS_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: types.GET_PAYMENT_DETAILS_FAILURE,
            payload: error.response?.data?.message || error.message,
        });
    }
};

/**
 * 5. GET WITHDRAWAL HISTORY
 */
export const getWithdrawalHistory = (jwt) => async (dispatch) => {
    dispatch({ type: types.GET_WITHDRAWAL_HISTORY_REQUEST });
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/withdrawal`,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        dispatch({
            type: types.GET_WITHDRAWAL_HISTORY_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: types.GET_WITHDRAWAL_HISTORY_FAILURE,
            payload: error.message,
        });
    }
};

/**
 * 6. GET ALL WITHDRAWAL REQUESTS (Admin)
 */
export const getAllWithdrawalRequests = (jwt) => async (dispatch) => {
    dispatch({ type: types.GET_WITHDRAWAL_REQUEST_REQUEST });
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/admin/withdrawal`,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        dispatch({
            type: types.GET_WITHDRAWAL_REQUEST_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: types.GET_WITHDRAWAL_REQUEST_FAILURE,
            payload: error.message,
        });
    }
};

/**
 * 7. PROCEED WITHDRAWAL (Admin Approval)
 */
export const proceedWithdrawal = ({ jwt, id, accept }) => async (dispatch) => {
    dispatch({ type: types.PROCEED_WITHDRAWAL_REQUEST });
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/api/admin/withdrawal/${id}/proceed/${accept}`,
            null,
            { headers: { Authorization: `Bearer ${jwt}` } }
        );
        dispatch({
            type: types.PROCEED_WITHDRAWAL_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: types.PROCEED_WITHDRAWAL_FAILURE,
            payload: error.message,
        });
    }
};