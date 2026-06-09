import {
  FETCH_COIN_LIST_REQUEST,
  FETCH_COIN_LIST_SUCCESS,
  FETCH_COIN_LIST_FAILURE,
  FETCH_TOP_50_COIN_REQUEST,
  FETCH_TOP_50_COIN_SUCCESS,
  FETCH_TOP_50_COIN_FAILURE,
  FETCH_MARKET_CHART_REQUEST,
  FETCH_MARKET_CHART_SUCCESS,
  FETCH_MARKET_CHART_FAILURE,
  FETCH_COIN_BY_ID_REQUEST,
  FETCH_COIN_BY_ID_SUCCESS,
  FETCH_COIN_BY_ID_FAILURE,
  FETCH_COIN_DETAILS_REQUEST,
  FETCH_COIN_DETAILS_SUCCESS,
  FETCH_COIN_DETAILS_FAILURE,
  SEARCH_COIN_REQUEST,
  SEARCH_COIN_SUCCESS,
  SEARCH_COIN_FAILURE,
} from "./ActionType";

const initialState = {
  coinList: [],
  currentPage: 1,
  top50: [],
  searchCoinList: [],
  marketChart: {
    data: [],
    loading: false,
  },
  coinById: null,
  coinDetails: null,
  loading: false,
  error: null,
};

const coinReducer = (state = initialState, action) => {
  switch (action.type) {
    // Fetch Coin List
    case FETCH_COIN_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_COIN_LIST_SUCCESS:
      return {
        ...state,
        coinList: action.payload.coins,
        currentPage: action.payload.page,
        loading: false,
        error: null,
      };

    case FETCH_COIN_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Fetch Top 50 Coins
    case FETCH_TOP_50_COIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_TOP_50_COIN_SUCCESS:
      return {
        ...state,
        top50: action.payload,
        loading: false,
        error: null,
      };

    case FETCH_TOP_50_COIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Fetch Market Chart
    case FETCH_MARKET_CHART_REQUEST:
      return {
        ...state,
        marketChart: {
          data: [],
          loading: true,
        },
        error: null,
      };

    case FETCH_MARKET_CHART_SUCCESS:
      return {
        ...state,
        marketChart: {
          data: action.payload.prices || action.payload,
          loading: false,
        },
        error: null,
      };

    case FETCH_MARKET_CHART_FAILURE:
      return {
        ...state,
        marketChart: {
          data: [],
          loading: false,
        },
        error: action.payload,
      };

    // Fetch Coin By ID
    case FETCH_COIN_BY_ID_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_COIN_BY_ID_SUCCESS:
      return {
        ...state,
        coinById: action.payload,
        loading: false,
        error: null,
      };

    case FETCH_COIN_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Fetch Coin Details
    case FETCH_COIN_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_COIN_DETAILS_SUCCESS:
      return {
        ...state,
        coinDetails: action.payload,
        loading: false,
        error: null,
      };

    case FETCH_COIN_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // Search Coin
    case SEARCH_COIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case SEARCH_COIN_SUCCESS:
      return {
        ...state,
        searchCoinList: action.payload,
        loading: false,
        error: null,
      };

    case SEARCH_COIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default coinReducer;
