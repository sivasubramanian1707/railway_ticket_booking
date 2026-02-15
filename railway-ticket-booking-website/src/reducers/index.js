import { combineReducers } from "redux";
import authReducer from "./auth";
import trainReducer from "./train";
import bookingReducer from "./booking";
import adminReducer from "./admin";

const rootReducer = combineReducers({
  auth: authReducer,
  train: trainReducer,
  booking: bookingReducer,
  admin: adminReducer,
});

export default rootReducer;
