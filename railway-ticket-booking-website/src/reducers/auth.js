import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOGOUT,
  CLEAR_ERROR,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
} from "../actions/auth";

const initialState = {
  token: localStorage.getItem("token") || null,
  userData: localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : null,
  loading: false,
  error: null,
  successMessage: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case SIGNUP_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        successMessage: null,
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        userData: action.payload.userData,
        loading: false,
        error: null,
        successMessage: "Login successful",
      };

    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        successMessage: "Signup successful. Please login.",
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        successMessage: "Password reset successful. Please login.",
      };

    case LOGIN_FAILURE:
    case SIGNUP_FAILURE:
    case FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        successMessage: null,
      };

    case LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        userData: null,
        error: null,
        successMessage: null,
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
        successMessage: null,
      };

    default:
      return state;
  }
};

export default authReducer;
