import api from "../helpers/api";
import { fetchStations } from "./train";

// Action Types
export const FETCH_ALL_BOOKINGS_REQUEST = "FETCH_ALL_BOOKINGS_REQUEST";
export const FETCH_ALL_BOOKINGS_SUCCESS = "FETCH_ALL_BOOKINGS_SUCCESS";
export const FETCH_ALL_BOOKINGS_FAILURE = "FETCH_ALL_BOOKINGS_FAILURE";

export const ADD_STATION_REQUEST = "ADD_STATION_REQUEST";
export const ADD_STATION_SUCCESS = "ADD_STATION_SUCCESS";
export const ADD_STATION_FAILURE = "ADD_STATION_FAILURE";

export const ADD_TRAIN_REQUEST = "ADD_TRAIN_REQUEST";
export const ADD_TRAIN_SUCCESS = "ADD_TRAIN_SUCCESS";
export const ADD_TRAIN_FAILURE = "ADD_TRAIN_FAILURE";

export const ADD_ROUTE_REQUEST = "ADD_ROUTE_REQUEST";
export const ADD_ROUTE_SUCCESS = "ADD_ROUTE_SUCCESS";
export const ADD_ROUTE_FAILURE = "ADD_ROUTE_FAILURE";

export const CLEAR_ADMIN_MESSAGE = "CLEAR_ADMIN_MESSAGE";

export const FETCH_TRAINS_REQUEST = "FETCH_TRAINS_REQUEST";
export const FETCH_TRAINS_SUCCESS = "FETCH_TRAINS_SUCCESS";
export const FETCH_TRAINS_FAILURE = "FETCH_TRAINS_FAILURE";

// Fetch all bookings (admin)
export const fetchAllBookings =
  (page = 1, limit = 10) =>
  async (dispatch) => {
    dispatch({ type: FETCH_ALL_BOOKINGS_REQUEST });
    try {
      const response = await api.get("/admin/bookings", {
        params: { page, limit },
      });
      dispatch({
        type: FETCH_ALL_BOOKINGS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_ALL_BOOKINGS_FAILURE,
        payload: error.response?.data?.error || "Failed to fetch bookings",
      });
    }
  };

// Add station
export const addStation = (name, code) => async (dispatch) => {
  dispatch({ type: ADD_STATION_REQUEST });
  try {
    const response = await api.post("/admin/station", { name, code });
    console.log("Station added successfully:", response.data);
    dispatch({
      type: ADD_STATION_SUCCESS,
      payload: response.data.station,
    });

    // Refresh public stations list so UI shows newly added stations everywhere
    try {
      dispatch(fetchStations());
    } catch (e) {
      // ignore
    }

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errorMessage ||
      "Failed to add station. Please try again.";
    dispatch({
      type: ADD_STATION_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Add train
export const addTrain =
  (trainNumber, trainName, totalSeats) => async (dispatch) => {
    dispatch({ type: ADD_TRAIN_REQUEST });
    try {
      const response = await api.post("/admin/train", {
        trainNumber,
        trainName,
        totalSeats,
      });

      dispatch({
        type: ADD_TRAIN_SUCCESS,
        payload: response.data.train,
      });
      // Refresh admin trains list after adding
      try {
        dispatch(fetchTrains());
      } catch (e) {
        // ignore
      }
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.errorMessage ||
        "Failed to add train. Please try again.";
      dispatch({
        type: ADD_TRAIN_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

// Add route
export const addRoute = (trainId, stops) => async (dispatch) => {
  dispatch({ type: ADD_ROUTE_REQUEST });
  try {
    const response = await api.post("/admin/route", { trainId, stops });
    dispatch({
      type: ADD_ROUTE_SUCCESS,
      payload: response.data.route,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errorMessage ||
      "Failed to add route. Please try again.";
    dispatch({
      type: ADD_ROUTE_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Fetch all trains (admin)
export const fetchTrains = () => async (dispatch) => {
  dispatch({ type: FETCH_TRAINS_REQUEST });
  try {
    // Expecting the backend to expose an admin trains endpoint
    const response = await api.get("/train");
    // Try several common payload shapes
    const payload = response.data.trains || response.data.data || response.data;
    dispatch({
      type: FETCH_TRAINS_SUCCESS,
      payload,
    });
  } catch (error) {
    dispatch({
      type: FETCH_TRAINS_FAILURE,
      payload: error.response?.data?.error || "Failed to fetch trains",
    });
  }
};

// Clear admin message
export const clearAdminMessage = () => (dispatch) => {
  dispatch({ type: CLEAR_ADMIN_MESSAGE });
};
