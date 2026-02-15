import api from "../helpers/api";

// Action Types
export const BOOK_TICKET_REQUEST = "BOOK_TICKET_REQUEST";
export const BOOK_TICKET_SUCCESS = "BOOK_TICKET_SUCCESS";
export const BOOK_TICKET_FAILURE = "BOOK_TICKET_FAILURE";

export const FETCH_MY_BOOKINGS_REQUEST = "FETCH_MY_BOOKINGS_REQUEST";
export const FETCH_MY_BOOKINGS_SUCCESS = "FETCH_MY_BOOKINGS_SUCCESS";
export const FETCH_MY_BOOKINGS_FAILURE = "FETCH_MY_BOOKINGS_FAILURE";

export const CANCEL_BOOKING_REQUEST = "CANCEL_BOOKING_REQUEST";
export const CANCEL_BOOKING_SUCCESS = "CANCEL_BOOKING_SUCCESS";
export const CANCEL_BOOKING_FAILURE = "CANCEL_BOOKING_FAILURE";

export const CLEAR_BOOKING_MESSAGE = "CLEAR_BOOKING_MESSAGE";

// Book a ticket
export const bookTicket =
  (trainId, fromStationId, toStationId, travelDate, seatsBooked, passengers) =>
  async (dispatch) => {
    dispatch({ type: BOOK_TICKET_REQUEST });
    try {
      const response = await api.post("/booking/create", {
        trainId,
        fromStationId,
        toStationId,
        travelDate,
        seatsBooked,
        passengers,
      });
      dispatch({
        type: BOOK_TICKET_SUCCESS,
        payload: response.data,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Booking failed. Please try again.";
      dispatch({
        type: BOOK_TICKET_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };

// Fetch user's bookings
export const fetchMyBookings = () => async (dispatch) => {
  dispatch({ type: FETCH_MY_BOOKINGS_REQUEST });
  try {
    const response = await api.get("/booking/my-bookings");
    dispatch({
      type: FETCH_MY_BOOKINGS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: FETCH_MY_BOOKINGS_FAILURE,
      payload: error.response?.data?.error || "Failed to fetch bookings",
    });
  }
};

// Cancel booking
export const cancelBooking = (bookingId) => async (dispatch) => {
  dispatch({ type: CANCEL_BOOKING_REQUEST });
  try {
    const response = await api.post(`/booking/cancel/${bookingId}`);
    dispatch({
      type: CANCEL_BOOKING_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Cancellation failed. Please try again.";
    dispatch({
      type: CANCEL_BOOKING_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Clear booking message
export const clearBookingMessage = () => (dispatch) => {
  dispatch({ type: CLEAR_BOOKING_MESSAGE });
};
