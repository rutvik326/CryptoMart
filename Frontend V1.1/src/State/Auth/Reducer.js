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

const initialState = {
    user: null,
    loading: false,
    error: null,
    jwt: null,
    twoFactorAuthEnabled: false,
    session: null,
    
    // ⭐ NEW: Forgot Password State
    forgotPassword: {
        email: null,
        otpSent: false,
        otpVerified: false,
        resetToken: null,
        error: null,
        loading: false,
        resetSuccess: false
    }
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_REQUEST:
        case LOGIN_REQUEST:
        case GET_USER_REQUEST:
        case UPDATE_USER_REQUEST:
        case SEND_VERIFICATION_OTP_REQUEST:
        case ENABLE_TWO_STEP_AUTHENTICATION_REQUEST:
        case DISABLE_TWO_STEP_AUTHENTICATION_REQUEST:
        case VERIFY_LOGIN_OTP_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case LOGIN_TWO_STEP_REQUEST:
            return {
                ...state,
                loading: false,
                error: null,
                twoFactorAuthEnabled: true,
                session: action.payload.session
            };

        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
        case VERIFY_LOGIN_OTP_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                jwt: action.payload,
                twoFactorAuthEnabled: false,
                session: null
            };

        case GET_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
        case SEND_VERIFICATION_OTP_SUCCESS:
        case ENABLE_TWO_STEP_AUTHENTICATION_SUCCESS:
        case DISABLE_TWO_STEP_AUTHENTICATION_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                user: action.payload
            };

        case REGISTER_FAILURE:
        case LOGIN_FAILURE:
        case GET_USER_FAILURE:
        case UPDATE_USER_FAILURE:
        case SEND_VERIFICATION_OTP_FAILURE:
        case ENABLE_TWO_STEP_AUTHENTICATION_FAILURE:
        case DISABLE_TWO_STEP_AUTHENTICATION_FAILURE:
        case VERIFY_LOGIN_OTP_FAILURE:
        case LOGIN_TWO_STEP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // ⭐ NEW: SEND FORGOT PASSWORD OTP CASES
        case SEND_FORGOT_PASSWORD_OTP_REQUEST:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: true,
                    error: null,
                    otpSent: false
                }
            };

        case SEND_FORGOT_PASSWORD_OTP_SUCCESS:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    email: action.payload.email,
                    otpSent: true,
                    error: null
                }
            };

        case SEND_FORGOT_PASSWORD_OTP_FAILURE:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    otpSent: false,
                    error: action.payload
                }
            };

        // ⭐ NEW: VERIFY FORGOT PASSWORD OTP CASES
        case VERIFY_FORGOT_PASSWORD_OTP_REQUEST:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: true,
                    error: null
                }
            };

        case VERIFY_FORGOT_PASSWORD_OTP_SUCCESS:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    otpVerified: true,
                    resetToken: action.payload.resetToken,
                    error: null
                }
            };

        case VERIFY_FORGOT_PASSWORD_OTP_FAILURE:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    otpVerified: false,
                    error: action.payload
                }
            };

        // ⭐ NEW: RESET PASSWORD CASES
        case RESET_PASSWORD_REQUEST:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: true,
                    error: null
                }
            };

        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    resetSuccess: true,
                    error: null
                }
            };

        case RESET_PASSWORD_FAILURE:
            return {
                ...state,
                forgotPassword: {
                    ...state.forgotPassword,
                    loading: false,
                    resetSuccess: false,
                    error: action.payload
                }
            };

        // ⭐ NEW: CLEAR FORGOT PASSWORD STATE
        case CLEAR_FORGOT_PASSWORD_STATE:
            return {
                ...state,
                forgotPassword: {
                    email: null,
                    otpSent: false,
                    otpVerified: false,
                    resetToken: null,
                    error: null,
                    loading: false,
                    resetSuccess: false
                }
            };

        case LOGOUT:
            return initialState;

        default:
            return state;
    }
};
