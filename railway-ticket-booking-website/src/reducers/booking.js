import {
  BOOK_TICKET_REQUEST,
  BOOK_TICKET_SUCCESS,
  BOOK_TICKET_FAILURE,
  FETCH_MY_BOOKINGS_REQUEST,
  FETCH_MY_BOOKINGS_SUCCESS,
  FETCH_MY_BOOKINGS_FAILURE,
  CANCEL_BOOKING_REQUEST,
  CANCEL_BOOKING_SUCCESS,
  CANCEL_BOOKING_FAILURE,
  CLEAR_BOOKING_MESSAGE,
} from "../actions/booking";

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  successMessage: null,
};

const bookingReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_TICKET_REQUEST:
    case FETCH_MY_BOOKINGS_REQUEST:
    case CANCEL_BOOKING_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        successMessage: null,
      };

    case BOOK_TICKET_SUCCESS:
      return {
        ...state,
        currentBooking: action.payload,
        loading: false,
        error: null,
        successMessage: "Booking successful!",
      };

    case FETCH_MY_BOOKINGS_SUCCESS:
      return {
        ...state,
        bookings: action.payload.bookings,
        loading: false,
        error: null,
      };

    case CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b._id === action.payload._id ? action.payload : b,
        ),
        loading: false,
        error: null,
        successMessage: "Booking cancelled successfully",
      };

    case BOOK_TICKET_FAILURE:
    case FETCH_MY_BOOKINGS_FAILURE:
    case CANCEL_BOOKING_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        successMessage: null,
      };

    case CLEAR_BOOKING_MESSAGE:
      return {
        ...state,
        error: null,
        successMessage: null,
      };

    default:
      return state;
  }
};

export default bookingReducer;
