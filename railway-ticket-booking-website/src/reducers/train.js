import {
  FETCH_STATIONS_REQUEST,
  FETCH_STATIONS_SUCCESS,
  FETCH_STATIONS_FAILURE,
  SEARCH_TRAINS_REQUEST,
  SEARCH_TRAINS_SUCCESS,
  SEARCH_TRAINS_FAILURE,
  CHECK_AVAILABILITY_REQUEST,
  CHECK_AVAILABILITY_SUCCESS,
  CHECK_AVAILABILITY_FAILURE,
  CLEAR_SEARCH_RESULTS,
} from "../actions/train";

const initialState = {
  stations: [],
  searchResults: [],
  availability: null,
  loading: false,
  error: null,
};

const trainReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_STATIONS_REQUEST:
    case SEARCH_TRAINS_REQUEST:
    case CHECK_AVAILABILITY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_STATIONS_SUCCESS:
      return {
        ...state,
        stations: action.payload,
        loading: false,
        error: null,
      };

    case SEARCH_TRAINS_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        loading: false,
        error: null,
      };

    case CHECK_AVAILABILITY_SUCCESS:
      return {
        ...state,
        availability: action.payload,
        loading: false,
        error: null,
      };

    case FETCH_STATIONS_FAILURE:
    case SEARCH_TRAINS_FAILURE:
    case CHECK_AVAILABILITY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: [],
        availability: null,
      };

    default:
      return state;
  }
};

export default trainReducer;
