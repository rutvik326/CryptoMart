import * as types from "./ActionType";

const initialState = {
    userWallet: {},
    loading: false,
    error: null,
    transactions: [],
    paymentOrder: null, // Added this so it's defined initially
};

const walletReducer = (state = initialState, action) => {
    switch (action.type) {
        // --- REQUEST CASES ---
        case types.GET_USER_WALLET_REQUEST:
        case types.DEPOSIT_MONEY_REQUEST:
        case types.TRANSFER_MONEY_REQUEST:
        case types.GET_WALLET_TRANSACTION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        // --- DEPOSIT SPECIFIC SUCCESS ---
        // Keeps the logic separate because the payload is different (payment link vs wallet object)
        case types.DEPOSIT_MONEY_SUCCESS:
            return {
                ...state,
                loading: false,
                paymentOrder: action.payload, 
                error: null,
            };

        // --- WALLET DATA SUCCESS ---
        // Removed DEPOSIT_MONEY_SUCCESS from here to avoid duplicate case conflict
        case types.GET_USER_WALLET_SUCCESS:
        case types.TRANSFER_MONEY_SUCCESS:
            return {
                ...state,
                userWallet: action.payload,
                loading: false,
                error: null,
            };

        // --- TRANSACTION SUCCESS ---
        case types.GET_WALLET_TRANSACTION_SUCCESS:
            return {
                ...state,
                transactions: action.payload,
                loading: false,
                error: null,
            };

        // --- FAILURE CASES ---
        case types.GET_USER_WALLET_FAILURE:
        case types.DEPOSIT_MONEY_FAILURE:
        case types.TRANSFER_MONEY_FAILURE:
        case types.GET_WALLET_TRANSACTION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload, // Changed to payload (standard Redux pattern)
            };

        default:
            return state;
    }
};

export default walletReducer;