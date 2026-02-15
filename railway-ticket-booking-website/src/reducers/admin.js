import {
  FETCH_ALL_BOOKINGS_REQUEST,
  FETCH_ALL_BOOKINGS_SUCCESS,
  FETCH_ALL_BOOKINGS_FAILURE,
  ADD_STATION_REQUEST,
  ADD_STATION_SUCCESS,
  ADD_STATION_FAILURE,
  ADD_TRAIN_REQUEST,
  ADD_TRAIN_SUCCESS,
  ADD_TRAIN_FAILURE,
  ADD_ROUTE_REQUEST,
  ADD_ROUTE_SUCCESS,
  ADD_ROUTE_FAILURE,
  CLEAR_ADMIN_MESSAGE,
  FETCH_TRAINS_REQUEST,
  FETCH_TRAINS_SUCCESS,
  FETCH_TRAINS_FAILURE,
} from "../actions/admin";

const initialState = {
  bookings: [],
  pagination: null,
  stations: [],
  trains: [],
  routes: [],
  loading: false,
  error: null,
  successMessage: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_BOOKINGS_REQUEST:
    case ADD_STATION_REQUEST:
    case ADD_TRAIN_REQUEST:
    case ADD_ROUTE_REQUEST:
    case FETCH_TRAINS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        successMessage: null,
      };

    case FETCH_ALL_BOOKINGS_SUCCESS:
      return {
        ...state,
        bookings: action.payload.data,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };

    case ADD_STATION_SUCCESS:
      return {
        ...state,
        stations: [...state.stations, action.payload],
        loading: false,
        error: null,
        successMessage: "Station added successfully",
      };

    case ADD_TRAIN_SUCCESS:
      return {
        ...state,
        trains: [...state.trains, action.payload],
        loading: false,
        error: null,
        successMessage: "Train added successfully",
      };

    case FETCH_TRAINS_SUCCESS:
      return {
        ...state,
        trains: Array.isArray(action.payload)
          ? action.payload
          : action.payload.data || state.trains,
        loading: false,
        error: null,
      };

    case ADD_ROUTE_SUCCESS:
      return {
        ...state,
        routes: [...state.routes, action.payload],
        loading: false,
        error: null,
        successMessage: "Route added successfully",
      };

    case FETCH_ALL_BOOKINGS_FAILURE:
    case ADD_STATION_FAILURE:
    case ADD_TRAIN_FAILURE:
    case ADD_ROUTE_FAILURE:
    case FETCH_TRAINS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        successMessage: null,
      };

    case CLEAR_ADMIN_MESSAGE:
      return {
        ...state,
        error: null,
        successMessage: null,
      };

    default:
      return state;
  }
};

export default adminReducer;
