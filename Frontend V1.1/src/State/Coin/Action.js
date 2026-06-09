import axios from "axios";
import api, { API_BASE_URL } from "../../config/api"; // Ensure api is imported correctly
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

// Helper to get error message safely
const getErrorMessage = (error) => {
  return error.response && error.response.data && error.response.data.message
    ? error.response.data.message
    : error.message;
};

// Get Coin List with pagination
export const getCoinList = (page) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_LIST_REQUEST });

  try {
    const { data } = await axios.get(`${API_BASE_URL}/coins?page=${page}`);
    
    dispatch({
      type: FETCH_COIN_LIST_SUCCESS,
      payload: {
        coins: data,
        page: page,
      },
    });
  } catch (error) {
    console.error("Error fetching coins:", error);
    dispatch({
      type: FETCH_COIN_LIST_FAILURE,
      payload: getErrorMessage(error),
    });
  }
};

// Get Top 50 Coins
export const getTop50CoinList = () => async (dispatch) => {
  dispatch({ type: FETCH_TOP_50_COIN_REQUEST });

  try {
    const { data } = await axios.get(`${API_BASE_URL}/coins/top50`);
    
    dispatch({
      type: FETCH_TOP_50_COIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("Top 50 Error:", error);
    dispatch({
      type: FETCH_TOP_50_COIN_FAILURE,
      payload: getErrorMessage(error),
    });
  }
};

// Fetch Market Chart Data
export const fetchMarketChart = ({ coinId, days, jwt }) => async (dispatch) => {
  dispatch({ type: FETCH_MARKET_CHART_REQUEST });

  try {
    const config = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {};
    
    const { data } = await api.get(`/coins/${coinId}/chart?days=${days}`, config);
    
    dispatch({
      type: FETCH_MARKET_CHART_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("Chart Error:", error);
    dispatch({
      type: FETCH_MARKET_CHART_FAILURE,
      payload: getErrorMessage(error),
    });
  }
};

// Fetch Coin By ID (Generic)
export const fetchCoinById = (coinId) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_BY_ID_REQUEST });

  try {
    const { data } = await axios.get(`${API_BASE_URL}/coins/${coinId}`);
    
    dispatch({
      type: FETCH_COIN_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("Coin By ID Error:", error);
    dispatch({
      type: FETCH_COIN_BY_ID_FAILURE,
      payload: getErrorMessage(error),
    });
  }
};

// Fetch Coin Details (FIXED JWT HANDLING)
export const fetchCoinDetails = ({ coinId, jwt }) => async (dispatch) => {
  dispatch({ type: FETCH_COIN_DETAILS_REQUEST });

  try {
    // FIX: Only add header if JWT exists to prevent "Bearer undefined" error
    const config = jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {};

    const { data } = await api.get(`/coins/details/${coinId}`, config);
    
    console.log("Coin Details Fetched:", data);
    dispatch({
      type: FETCH_COIN_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("Details Error:", error);
    dispatch({
      type: FETCH_COIN_DETAILS_FAILURE,
      payload: getErrorMessage(error),
    });
  }
};

// Search Coin
export const searchCoin = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_COIN_REQUEST });

  try {
    const { data } = await api.get(`/coins/search?q=${keyword}`);
    
    dispatch({
      type: SEARCH_COIN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log("Search Error:", error);
    dispatch({
      type: SEARCH_COIN_FAILURE,
      payload: getErrorMessage(error),
    });
  }
};