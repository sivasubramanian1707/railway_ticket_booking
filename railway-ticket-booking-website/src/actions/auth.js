import api from "../helpers/api";

// Action Types
export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const LOGOUT = "LOGOUT";
export const CLEAR_ERROR = "CLEAR_ERROR";

export const FORGOT_PASSWORD_REQUEST = "FORGOT_PASSWORD_REQUEST";
export const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS";
export const FORGOT_PASSWORD_FAILURE = "FORGOT_PASSWORD_FAILURE";

// Login thunk
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await api.post("/auth/sign-in", { email, password });
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userData", JSON.stringify(response.data.userData));
    console.log("Login successful, token stored:", response.data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: response.data.token,
        userData: response.data.userData,
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errorMessage || "Login failed. Please try again.";
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Signup thunk
export const signup = (name, email, phoneNo, password) => async (dispatch) => {
  dispatch({ type: SIGNUP_REQUEST });
  try {
    const response = await api.post("/auth/sign-up", {
      name,
      email,
      phoneNo,
      password,
    });
    dispatch({
      type: SIGNUP_SUCCESS,
      payload: response.data.user,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errorMessage || "Signup failed. Please try again.";
    dispatch({
      type: SIGNUP_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Logout thunk
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
};

// Forgot password thunk
export const forgotPassword = (email, password) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const response = await api.post("/auth/forgot-password", {
      email,
      password,
    });
    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errorMessage ||
      "Password reset failed. Please try again.";
    dispatch({
      type: FORGOT_PASSWORD_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};

// Clear error action
export const clearError = () => (dispatch) => {
  dispatch({ type: CLEAR_ERROR });
};
