import * as types from "./ActionType";

const initialState = {
  withdrawal: null,
  history: [],
  loading: false,
  error: null,
  paymentDetails: null, // Stores the user's active bank account
  requests: [], // Used for Admin views
};

const withdrawalReducer = (state = initialState, action) => {
  switch (action.type) {
    // Consolidated all Request/Loading states
    case types.WITHDRAW_MONEY_REQUEST:
    case types.GET_PAYMENT_DETAILS_REQUEST:
    case types.GET_WITHDRAWAL_HISTORY_REQUEST:
    case types.GET_WITHDRAWAL_REQUEST_REQUEST:
    case types.ADD_PAYMENT_DETAILS_REQUEST:
    case types.UPDATE_PAYMENT_DETAILS_REQUEST: // Added update request
    case types.PROCEED_WITHDRAWAL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.WITHDRAW_MONEY_SUCCESS:
      return {
        ...state,
        withdrawal: action.payload,
        loading: false,
        error: null,
      };

    /**
     * Handles fetching, adding, and updating bank details.
     * All three actions return the same payment details object structure.
     */
    case types.GET_PAYMENT_DETAILS_SUCCESS:
    case types.ADD_PAYMENT_DETAILS_SUCCESS:
    case types.UPDATE_PAYMENT_DETAILS_SUCCESS: // Added update success
      return {
        ...state,
        paymentDetails: action.payload,
        loading: false,
        error: null,
      };

    case types.GET_WITHDRAWAL_HISTORY_SUCCESS:
      return {
        ...state,
        history: action.payload,
        loading: false,
        error: null,
      };

    case types.GET_WITHDRAWAL_REQUEST_SUCCESS:
      return {
        ...state,
        requests: action.payload,
        loading: false,
        error: null,
      };

    /**
     * Updates a single request in the list (used by Admin)
     */
    case types.PROCEED_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        requests: state.requests.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        loading: false,
        error: null,
      };

    // Consolidated all Failure/Error states
    case types.WITHDRAW_MONEY_FAILURE:
    case types.GET_PAYMENT_DETAILS_FAILURE:
    case types.GET_WITHDRAWAL_HISTORY_FAILURE:
    case types.GET_WITHDRAWAL_REQUEST_FAILURE:
    case types.PROCEED_WITHDRAWAL_FAILURE:
    case types.ADD_PAYMENT_DETAILS_FAILURE:
    case types.UPDATE_PAYMENT_DETAILS_FAILURE: // Added update failure
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default withdrawalReducer;