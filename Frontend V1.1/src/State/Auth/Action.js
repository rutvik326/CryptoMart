import axios from 'axios';
import {
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAILURE,
    SEND_VERIFICATION_OTP_REQUEST,
    SEND_VERIFICATION_OTP_SUCCESS,
    SEND_VERIFICATION_OTP_FAILURE,
    ENABLE_TWO_STEP_AUTHENTICATION_REQUEST,
    ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
    ENABLE_TWO_STEP_AUTHENTICATION_FAILURE,
    DISABLE_TWO_STEP_AUTHENTICATION_REQUEST,
    DISABLE_TWO_STEP_AUTHENTICATION_SUCCESS,
    DISABLE_TWO_STEP_AUTHENTICATION_FAILURE,
    LOGIN_TWO_STEP_REQUEST,
    LOGIN_TWO_STEP_SUCCESS,
    LOGIN_TWO_STEP_FAILURE,
    VERIFY_LOGIN_OTP_REQUEST,
    VERIFY_LOGIN_OTP_SUCCESS,
    VERIFY_LOGIN_OTP_FAILURE,
    SEND_FORGOT_PASSWORD_OTP_REQUEST,
    SEND_FORGOT_PASSWORD_OTP_SUCCESS,
    SEND_FORGOT_PASSWORD_OTP_FAILURE,
    VERIFY_FORGOT_PASSWORD_OTP_REQUEST,
    VERIFY_FORGOT_PASSWORD_OTP_SUCCESS,
    VERIFY_FORGOT_PASSWORD_OTP_FAILURE,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    CLEAR_FORGOT_PASSWORD_STATE,
    LOGOUT
} from './ActionTypes';

const BASE_URL = "http://localhost:5454";

// ... (Keep all your existing actions: register, login, verifyLoginOtp, getUser, updateUser, etc.)

export const register = (userData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const response = await axios.post(`${BASE_URL}/auth/signup`, userData.data);
        const user = response.data;
        console.log("user", user);
        
        if (user.jwt) {
            localStorage.setItem("jwt", user.jwt);
        }
        
        dispatch({ 
            type: REGISTER_SUCCESS, 
            payload: user.jwt 
        });
        
        userData.navigate("/");
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data || 
                            error.message || 
                            "Registration failed";
        
        console.log("Registration error:", errorMessage);
        
        dispatch({ 
            type: REGISTER_FAILURE, 
            payload: errorMessage 
        });
        
        throw new Error(errorMessage);
    }
};

export const login = (userData) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
        const response = await axios.post(`${BASE_URL}/auth/signin`, userData.data);
        const user = response.data;
        console.log("Login response:", user);
        
        if (user.twoFactorAuthEnabled === true) {
            console.log("2FA enabled, session:", user.session);
            
            dispatch({ 
                type: LOGIN_TWO_STEP_REQUEST,
                payload: {
                    session: user.session,
                    message: user.message
                }
            });
            
            return { 
                twoFactorAuthEnabled: true, 
                session: user.session 
            };
        }
        
        console.log("2FA not enabled");
        
        if (user.jwt) {
            localStorage.setItem("jwt", user.jwt);
        }
        
        dispatch({ 
            type: LOGIN_SUCCESS, 
            payload: user.jwt 
        });
        
        userData.navigate("/");
        return { twoFactorAuthEnabled: false };
        
    } catch (error) {
        dispatch({ 
            type: LOGIN_FAILURE, 
            payload: error.message 
        });
        console.log("Login error:", error);
        throw error;
    }
};

export const verifyLoginOtp = (otpData) => async (dispatch) => {
    dispatch({ type: VERIFY_LOGIN_OTP_REQUEST });
    try {
        console.log("Verifying OTP:", otpData.otp);
        console.log("Session ID:", otpData.session);
        
        const response = await axios.post(
            `${BASE_URL}/auth/two-factor/otp/${otpData.otp}`,
            {},
            {
                params: {
                    id: otpData.session
                }
            }
        );
        
        const user = response.data;
        console.log("OTP verification successful");
        
        if (user.jwt) {
            localStorage.setItem("jwt", user.jwt);
        }
        
        dispatch({ 
            type: VERIFY_LOGIN_OTP_SUCCESS, 
            payload: user.jwt 
        });
        
        otpData.navigate("/");
        return user;
        
    } catch (error) {
        console.error("OTP verification failed:", error.response?.data || error.message);
        
        dispatch({ 
            type: VERIFY_LOGIN_OTP_FAILURE, 
            payload: error.message 
        });
        throw error;
    }
};

export const getUser = (jwt) => async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
        const response = await axios.get(`${BASE_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        const user = response.data;
        console.log("user", user);
        
        dispatch({ 
            type: GET_USER_SUCCESS, 
            payload: user 
        });
    } catch (error) {
        dispatch({ 
            type: GET_USER_FAILURE, 
            payload: error.message 
        });
        console.log("error", error);
    }
};

export const updateUser = (userData) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.put(
            `${BASE_URL}/api/users/profile`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );
        const user = response.data;
        console.log("Updated user", user);
        
        dispatch({ 
            type: UPDATE_USER_SUCCESS, 
            payload: user 
        });
        
        dispatch(getUser(jwt));
        
        return user;
    } catch (error) {
        dispatch({ 
            type: UPDATE_USER_FAILURE, 
            payload: error.message 
        });
        console.log("error", error);
        throw error;
    }
};

export const sendVerificationOtp = () => async (dispatch) => {
    dispatch({ type: SEND_VERIFICATION_OTP_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.post(
            `${BASE_URL}/api/users/auth/two-factor/enable`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );
        const user = response.data;
        console.log("OTP sent", user);
        
        dispatch({ 
            type: SEND_VERIFICATION_OTP_SUCCESS, 
            payload: user 
        });
        
        return user;
    } catch (error) {
        dispatch({ 
            type: SEND_VERIFICATION_OTP_FAILURE, 
            payload: error.message 
        });
        console.log("error", error);
        throw error;
    }
};

export const enableTwoFactorAuthentication = (otp) => async (dispatch) => {
    dispatch({ type: ENABLE_TWO_STEP_AUTHENTICATION_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.patch(
            `${BASE_URL}/api/users/enable-two-factor/verify-otp/${otp}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );
        const user = response.data;
        console.log("2FA enabled", user);
        
        dispatch({ 
            type: ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS, 
            payload: user 
        });
        
        dispatch(getUser(jwt));
        
        return user;
    } catch (error) {
        dispatch({ 
            type: ENABLE_TWO_STEP_AUTHENTICATION_FAILURE, 
            payload: error.message 
        });
        console.log("error", error);
        throw error;
    }
};

export const disableTwoFactorAuthentication = () => async (dispatch) => {
    dispatch({ type: DISABLE_TWO_STEP_AUTHENTICATION_REQUEST });
    try {
        const jwt = localStorage.getItem("jwt");
        const response = await axios.patch(
            `${BASE_URL}/api/users/disable-two-factor`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );
        const user = response.data;
        console.log("2FA disabled", user);
        
        dispatch({ 
            type: DISABLE_TWO_STEP_AUTHENTICATION_SUCCESS, 
            payload: user 
        });
        
        dispatch(getUser(jwt));
        
        return user;
    } catch (error) {
        dispatch({ 
            type: DISABLE_TWO_STEP_AUTHENTICATION_FAILURE, 
            payload: error.message 
        });
        console.log("error", error);
        throw error;
    }
};

export const logout = () => async (dispatch) => {
    localStorage.clear();
    dispatch({ type: LOGOUT });
};

// ⭐ NEW ACTION 1: SEND FORGOT PASSWORD OTP
export const sendForgotPasswordOtp = (email) => async (dispatch) => {
    dispatch({ type: SEND_FORGOT_PASSWORD_OTP_REQUEST });

    try {
        console.log("📤 Sending forgot password OTP to:", email);

        const response = await axios.post(
            `${BASE_URL}/auth/forgot-password/send-otp`,
            { email }
        );

        console.log("✅ OTP sent successfully:", response.data);

        dispatch({
            type: SEND_FORGOT_PASSWORD_OTP_SUCCESS,
            payload: response.data
        });

        return { success: true, data: response.data };

    } catch (error) {
        console.error("❌ Send OTP failed:", error.response?.data || error.message);

        const errorMessage = error.response?.data?.message || "Failed to send OTP. Please try again.";

        dispatch({
            type: SEND_FORGOT_PASSWORD_OTP_FAILURE,
            payload: errorMessage
        });

        return { success: false, message: errorMessage };
    }
};

// ⭐ NEW ACTION 2: VERIFY FORGOT PASSWORD OTP
export const verifyForgotPasswordOtp = (email, otp) => async (dispatch) => {
    dispatch({ type: VERIFY_FORGOT_PASSWORD_OTP_REQUEST });

    try {
        console.log("🔍 Verifying OTP for:", email);

        const response = await axios.post(
            `${BASE_URL}/auth/forgot-password/verify-otp`,
            { email, otp }
        );

        console.log("✅ OTP verified successfully:", response.data);

        dispatch({
            type: VERIFY_FORGOT_PASSWORD_OTP_SUCCESS,
            payload: response.data
        });

        return { success: true, data: response.data };

    } catch (error) {
        console.error("❌ OTP verification failed:", error.response?.data || error.message);

        const errorMessage = error.response?.data?.message || "Invalid OTP. Please try again.";

        dispatch({
            type: VERIFY_FORGOT_PASSWORD_OTP_FAILURE,
            payload: errorMessage
        });

        return { success: false, message: errorMessage };
    }
};

// ⭐ NEW ACTION 3: RESET PASSWORD
export const resetPassword = (email, resetToken, newPassword, confirmPassword) => async (dispatch) => {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    try {
        console.log("🔑 Resetting password for:", email);

        const response = await axios.post(
            `${BASE_URL}/auth/forgot-password/reset`,
            { email, resetToken, newPassword, confirmPassword }
        );

        console.log("✅ Password reset successfully:", response.data);

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: response.data
        });

        return { success: true, data: response.data };

    } catch (error) {
        console.error("❌ Password reset failed:", error.response?.data || error.message);

        const errorMessage = error.response?.data?.message || "Failed to reset password. Please try again.";

        dispatch({
            type: RESET_PASSWORD_FAILURE,
            payload: errorMessage
        });

        return { success: false, message: errorMessage };
    }
};

// ⭐ NEW ACTION 4: CLEAR FORGOT PASSWORD STATE
export const clearForgotPasswordState = () => (dispatch) => {
    dispatch({ type: CLEAR_FORGOT_PASSWORD_STATE });
};
