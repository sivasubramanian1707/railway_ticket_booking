import api from "../helpers/api";

// Action Types
export const FETCH_STATIONS_REQUEST = "FETCH_STATIONS_REQUEST";
export const FETCH_STATIONS_SUCCESS = "FETCH_STATIONS_SUCCESS";
export const FETCH_STATIONS_FAILURE = "FETCH_STATIONS_FAILURE";

export const SEARCH_TRAINS_REQUEST = "SEARCH_TRAINS_REQUEST";
export const SEARCH_TRAINS_SUCCESS = "SEARCH_TRAINS_SUCCESS";
export const SEARCH_TRAINS_FAILURE = "SEARCH_TRAINS_FAILURE";

export const CHECK_AVAILABILITY_REQUEST = "CHECK_AVAILABILITY_REQUEST";
export const CHECK_AVAILABILITY_SUCCESS = "CHECK_AVAILABILITY_SUCCESS";
export const CHECK_AVAILABILITY_FAILURE = "CHECK_AVAILABILITY_FAILURE";

export const GET_TRAIN_DETAILS_REQUEST = "GET_TRAIN_DETAILS_REQUEST";
export const GET_TRAIN_DETAILS_SUCCESS = "GET_TRAIN_DETAILS_SUCCESS";
export const GET_TRAIN_DETAILS_FAILURE = "GET_TRAIN_DETAILS_FAILURE";

export const CLEAR_SEARCH_RESULTS = "CLEAR_SEARCH_RESULTS";

// Fetch all stations
export const fetchStations = () => async (dispatch) => {
  dispatch({ type: FETCH_STATIONS_REQUEST });
  try {
    const response = await api.get("/train/stations");
    console.log("Fetched stations:", response.data);
    dispatch({
      type: FETCH_STATIONS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_STATIONS_FAILURE,
      payload: error.response?.data?.error || "Failed to fetch stations",
    });
  }
};

// Search trains
export const searchTrains = (from, to) => async (dispatch) => {
  dispatch({ type: SEARCH_TRAINS_REQUEST });
  try {
    const response = await api.get("/train/search", {
      params: { from, to },
    });
    console.log("Search results:", response.data);
    dispatch({
      type: SEARCH_TRAINS_SUCCESS,
      payload: response.data.trains,
    });
  } catch (error) {
    dispatch({
      type: SEARCH_TRAINS_FAILURE,
      payload: error.response?.data?.message || "Failed to search trains",
    });
  }
};

// Check seat availability
export const checkAvailability = (trainId, travelDate) => async (dispatch) => {
  dispatch({ type: CHECK_AVAILABILITY_REQUEST });
  try {
    const response = await api.post("/booking/check-availability", {
      trainId,
      travelDate,
    });
    dispatch({
      type: CHECK_AVAILABILITY_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: CHECK_AVAILABILITY_FAILURE,
      payload: error.response?.data?.message || "Failed to check availability",
    });
    throw error;
  }
};

// Clear search results
export const clearSearchResults = () => (dispatch) => {
  dispatch({ type: CLEAR_SEARCH_RESULTS });
};
