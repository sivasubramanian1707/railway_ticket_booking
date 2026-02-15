# Redux Architecture Guide

## Redux Overview

Redux is a predictable state management library that helps manage complex application state in a centralized store. This guide explains how Redux is implemented in the Railway Ticket Booking Website.

---

## Redux Core Concepts

### 1. **Store**

A single object that holds the entire application state.

**File:** [src/store/store.js](src/store/store.js)

```javascript
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "../reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));
export default store;
```

**Key Points:**

- Created using `createStore()` from Redux
- Middleware: `redux-thunk` for handling async actions
- Root reducer combines all reducers

---

### 2. **Actions**

Objects that describe what happened. Always have a `type` property.

**Example Action Object:**

```javascript
{
  type: "LOGIN_SUCCESS",
  payload: {
    token: "jwt_token_here",
    userData: { name: "John", email: "john@example.com" }
  }
}
```

**Types of Actions:**

- **Synchronous Actions:** Dispatched directly
- **Async Actions (Thunks):** Dispatched with redux-thunk middleware

---

### 3. **Reducers**

Pure functions that take the current state and an action, return new state.

**Pure Reducer Function:**

```javascript
(previousState, action) => newState;
```

**Rules:**

- Must be pure (no side effects)
- Must not mutate the input state
- Must return new state objects
- Should handle unknown action types by returning state

---

### 4. **Dispatch**

Function to send actions to the store.

```javascript
dispatch(action); // Synchronous action
dispatch(asyncActionCreator); // Async action (thunk)
```

---

### 5. **Selectors**

Functions that extract data from the store state.

```javascript
const auth = useSelector((state) => state.auth);
const token = useSelector((state) => state.auth.token);
const loading = useSelector((state) => state.auth.loading);
```

---

## Application State Structure

```
Redux Store
├── auth (authReducer)
│   ├── token: string | null
│   ├── userData: object | null
│   ├── loading: boolean
│   ├── error: string | null
│   └── successMessage: string | null
│
├── train (trainReducer)
│   ├── stations: array
│   ├── searchResults: array
│   ├── availability: object | null
│   ├── loading: boolean
│   └── error: string | null
│
├── booking (bookingReducer)
│   ├── bookings: array
│   ├── currentBooking: object | null
│   ├── loading: boolean
│   ├── error: string | null
│   └── successMessage: string | null
│
└── admin (adminReducer)
    ├── bookings: array
    ├── pagination: object | null
    ├── stations: array
    ├── trains: array
    ├── routes: array
    ├── loading: boolean
    ├── error: string | null
    └── successMessage: string | null
```

---

## Reducers Deep Dive

### Authentication Reducer

**File:** [src/reducers/auth.js](src/reducers/auth.js)

**Initial State:**

```javascript
{
  token: localStorage.getItem("token") || null,
  userData: null,
  loading: false,
  error: null,
  successMessage: null
}
```

**Action Handling:**

| Action                    | State Changes                                         |
| ------------------------- | ----------------------------------------------------- |
| `LOGIN_REQUEST`           | `loading = true`, clears errors                       |
| `LOGIN_SUCCESS`           | Sets `token` and `userData`, `loading = false`        |
| `LOGIN_FAILURE`           | Sets `error`, `loading = false`                       |
| `LOGOUT`                  | Clears `token`, `userData`, removes from localStorage |
| `SIGNUP_SUCCESS`          | `loading = false`, sets success message               |
| `FORGOT_PASSWORD_SUCCESS` | `loading = false`, sets success message               |
| `CLEAR_ERROR`             | Clears `error` and `successMessage`                   |

**Token Persistence:**

```javascript
// Initial state reads from localStorage
token: localStorage.getItem("token") || null;

// On LOGIN_SUCCESS, token stored in localStorage
localStorage.setItem("token", response.data.token);

// On LOGOUT, token removed
localStorage.removeItem("token");

// On 401 error, token removed by API interceptor
```

---

### Train Reducer

**File:** [src/reducers/train.js](src/reducers/train.js)

**Initial State:**

```javascript
{
  stations: [],
  searchResults: [],
  availability: null,
  loading: false,
  error: null
}
```

**Purpose:** Manages train-related data for search and availability

**Action Handling:**

| Action                       | State Changes                               |
| ---------------------------- | ------------------------------------------- |
| `FETCH_STATIONS_REQUEST`     | `loading = true`, clears errors             |
| `FETCH_STATIONS_SUCCESS`     | Sets `stations` array, `loading = false`    |
| `SEARCH_TRAINS_REQUEST`      | `loading = true`                            |
| `SEARCH_TRAINS_SUCCESS`      | Sets `searchResults`, `loading = false`     |
| `CHECK_AVAILABILITY_REQUEST` | `loading = true`                            |
| `CHECK_AVAILABILITY_SUCCESS` | Sets `availability` data, `loading = false` |
| `CLEAR_SEARCH_RESULTS`       | Resets `searchResults` and `availability`   |

**Usage Flow:**

```
User visits Search page
  ↓
dispatch(fetchStations())
  ↓
Stations loaded in state.train.stations
  ↓
User selects from/to stations
  ↓
dispatch(searchTrains(from, to))
  ↓
Search results loaded in state.train.searchResults
  ↓
User selects a train
  ↓
dispatch(checkAvailability(trainId, date))
  ↓
Availability loaded in state.train.availability
```

---

### Booking Reducer

**File:** [src/reducers/booking.js](src/reducers/booking.js)

**Initial State:**

```javascript
{
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  successMessage: null
}
```

**Purpose:** Manages user bookings and booking operations

**Action Handling:**

| Action                      | State Changes                          |
| --------------------------- | -------------------------------------- |
| `BOOK_TICKET_REQUEST`       | `loading = true`                       |
| `BOOK_TICKET_SUCCESS`       | Sets `currentBooking`, success message |
| `FETCH_MY_BOOKINGS_REQUEST` | `loading = true`                       |
| `FETCH_MY_BOOKINGS_SUCCESS` | Sets `bookings` array                  |
| `CANCEL_BOOKING_SUCCESS`    | Updates booking in `bookings` array    |
| `CLEAR_BOOKING_MESSAGE`     | Clears messages                        |

**Booking Status States:**

- `CONFIRMED` - Booking confirmed
- `PENDING` - Waiting for confirmation
- `CANCELLED` - User cancelled

---

### Admin Reducer

**File:** [src/reducers/admin.js](src/reducers/admin.js)

**Initial State:**

```javascript
{
  bookings: [],
  pagination: null,
  stations: [],
  trains: [],
  routes: [],
  loading: false,
  error: null,
  successMessage: null
}
```

**Purpose:** Manages admin-only operations and data

**Action Handling:**

| Action                       | State Changes                    |
| ---------------------------- | -------------------------------- |
| `FETCH_ALL_BOOKINGS_SUCCESS` | Sets `bookings` and `pagination` |
| `ADD_STATION_SUCCESS`        | Adds station to `stations` array |
| `ADD_TRAIN_SUCCESS`          | Adds train to `trains` array     |
| `ADD_ROUTE_SUCCESS`          | Adds route to `routes` array     |
| `CLEAR_ADMIN_MESSAGE`        | Clears messages                  |

**Pagination Example:**

```javascript
pagination: {
  total: 523,      // Total bookings in database
  page: 1,         // Current page
  limit: 10,       // Items per page
  pages: 53        // Total pages (total / limit)
}
```

---

## Action Creators & Async Thunks

### What is a Thunk?

A thunk is a function that returns a function. It's used to delay computation or perform side effects.

**Redux-Thunk Pattern:**

```javascript
const asyncAction = (payload) => async (dispatch) => {
  dispatch({ type: "REQUEST" });
  try {
    const response = await apiCall(payload);
    dispatch({ type: "SUCCESS", payload: response });
  } catch (error) {
    dispatch({ type: "FAILURE", payload: error });
  }
};
```

### Auth Thunks

#### login(email, password)

**File:** [src/actions/auth.js#L18](src/actions/auth.js#L18)

```javascript
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await api.post("/auth/sign-in", { email, password });
    localStorage.setItem("token", response.data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: response.data.token,
        userData: response.data.userData,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.errorMessage || "Login failed";
    dispatch({
      type: LOGIN_FAILURE,
      payload: errorMessage,
    });
    throw error; // Throw to component can handle
  }
};
```

**Flow:**

1. Dispatch `LOGIN_REQUEST` (start loading)
2. Make POST request to `/auth/sign-in`
3. On success:
   - Store token in localStorage
   - Dispatch `LOGIN_SUCCESS` with token and userData
   - Return response to component
4. On error:
   - Dispatch `LOGIN_FAILURE` with error message
   - Throw error to component

#### logout()

**File:** [src/actions/auth.js#L68](src/actions/auth.js#L68)

```javascript
export const logout = () => (dispatch) => {
  localStorage.removeItem("token");
  dispatch({ type: LOGOUT });
};
```

**Note:** Simple synchronous action, no API call needed

---

### Train Thunks

#### fetchStations()

**File:** [src/actions/train.js#L22](src/actions/train.js#L22)

```javascript
export const fetchStations = () => async (dispatch) => {
  dispatch({ type: FETCH_STATIONS_REQUEST });
  try {
    const response = await api.get("/train/stations");
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
```

#### searchTrains(from, to)

**File:** [src/actions/train.js#L35](src/actions/train.js#L35)

```javascript
export const searchTrains = (from, to) => async (dispatch) => {
  dispatch({ type: SEARCH_TRAINS_REQUEST });
  try {
    const response = await api.get("/train/search", {
      params: { from, to },
    });
    dispatch({
      type: SEARCH_TRAINS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: SEARCH_TRAINS_FAILURE,
      payload: error.response?.data?.message || "Failed to search trains",
    });
  }
};
```

**Key Points:**

- Uses query parameters with `params` option
- Handles response which may be `{ trains: [...] }` or direct array

---

### Booking Thunks

#### bookTicket()

**File:** [src/actions/booking.js#L18](src/actions/booking.js#L18)

```javascript
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
      const errorMessage = error.response?.data?.error || "Booking failed";
      dispatch({
        type: BOOK_TICKET_FAILURE,
        payload: errorMessage,
      });
      throw error;
    }
  };
```

**Usage in Component:**

```javascript
const handleBooking = async () => {
  try {
    const booking = await dispatch(bookTicket(...));
    // Show confirmation
  } catch (error) {
    // Error already in Redux state
  }
};
```

#### fetchMyBookings()

**File:** [src/actions/booking.js#L56](src/actions/booking.js#L56)

```javascript
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
```

#### cancelBooking(bookingId)

**File:** [src/actions/booking.js#L74](src/actions/booking.js#L74)

```javascript
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
    const errorMessage = error.response?.data?.error || "Cancellation failed";
    dispatch({
      type: CANCEL_BOOKING_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};
```

---

### Admin Thunks

#### fetchAllBookings(page, limit)

**File:** [src/actions/admin.js#L22](src/actions/admin.js#L22)

```javascript
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
```

**Pagination Handling:**

- Default page = 1
- Default limit = 10
- Response includes both data and pagination info

#### addStation(name, code)

**File:** [src/actions/admin.js#L48](src/actions/admin.js#L48)

```javascript
export const addStation = (name, code) => async (dispatch) => {
  dispatch({ type: ADD_STATION_REQUEST });
  try {
    const response = await api.post("/admin/add-station", { name, code });
    dispatch({
      type: ADD_STATION_SUCCESS,
      payload: response.data.station,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.errorMessage || "Failed to add station";
    dispatch({
      type: ADD_STATION_FAILURE,
      payload: errorMessage,
    });
    throw error;
  }
};
```

#### addTrain(trainNumber, trainName, totalSeats)

**File:** [src/actions/admin.js#L68](src/actions/admin.js#L68)

#### addRoute(trainId, stops)

**File:** [src/actions/admin.js#L88](src/actions/admin.js#L88)

---

## Using Redux in Components

### Hook: useSelector

Get state from Redux store:

```javascript
import { useSelector } from "react-redux";

function MyComponent() {
  // Get entire auth state
  const auth = useSelector((state) => state.auth);

  // Get specific values
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  return <div>{/* Use auth data */}</div>;
}
```

### Hook: useDispatch

Dispatch actions:

```javascript
import { useDispatch } from 'react-redux';
import { login } from '../actions/auth';

function LoginComponent() {
  const dispatch = useDispatch();

  const handleLogin = (email, password) => {
    // Dispatch sync action
    dispatch({ type: 'SOME_ACTION' });

    // Dispatch async action (thunk)
    dispatch(login(email, password));
  };

  return <button onClick={() => handleLogin(...)}>Login</button>;
}
```

### Complete Component Example

```javascript
import { useDispatch, useSelector } from "react-redux";
import { searchTrains, fetchStations } from "../actions/train";

function SearchPage() {
  const dispatch = useDispatch();
  const { stations, searchResults, loading, error } = useSelector(
    (state) => state.train,
  );
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    // Fetch stations on component mount
    dispatch(fetchStations());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(searchTrains(from, to));
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <select value={from} onChange={(e) => setFrom(e.target.value)}>
        <option value="">Select From</option>
        {stations.map((station) => (
          <option key={station._id} value={station._id}>
            {station.name}
          </option>
        ))}
      </select>

      <select value={to} onChange={(e) => setTo(e.target.value)}>
        <option value="">Select To</option>
        {stations.map((station) => (
          <option key={station._id} value={station._id}>
            {station.name}
          </option>
        ))}
      </select>

      <button onClick={handleSearch}>Search</button>

      {searchResults && (
        <div>
          {searchResults.map((train) => (
            <div key={train._id}>
              <h3>{train.trainName}</h3>
              <p>{train.trainNumber}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
```

---

## Redux Flow Diagram

```
1. User Action (Submit Form)
   ↓
2. Component Dispatches Action
   dispatch(login(email, password))
   ↓
3. Redux-Thunk Middleware
   Intercepts action creator function
   ↓
4. Async Action Creator
   - dispatch(LOGIN_REQUEST) - Show loading
   - Make API call
   ↓
5a. API SUCCESS
   - dispatch(LOGIN_SUCCESS, payload)
   ↓
5b. API FAILURE
   - dispatch(LOGIN_FAILURE, error)
   ↓
6. Reducer Processes Action
   - Returns new state
   ↓
7. Store Updated
   - Subscribers notified
   ↓
8. Components Re-render
   - useSelector picks new state
   - Component displays new data
```

---

## Best Practices

### 1. Keep Reducers Pure

```javascript
// ✅ GOOD
case LOGIN_SUCCESS:
  return {
    ...state,
    token: action.payload.token,
    loading: false
  };

// ❌ BAD - Mutating state
case LOGIN_SUCCESS:
  state.token = action.payload.token;
  state.loading = false;
  return state;
```

### 2. Normalize State

```javascript
// ✅ GOOD - Flat structure
bookings: [{ _id: 1, ... }, { _id: 2, ... }]

// ❌ AVOID - Nested structure (if large data)
bookingsById: {
  "1": { _id: 1, ... },
  "2": { _id: 2, ... }
}
```

### 3. Handle Loading & Error States

```javascript
// ✅ GOOD
if (loading) return <Loading />;
if (error) return <Error message={error} />;
return <Data data={data} />;

// ❌ BAD - No loading/error handling
return <Data data={data} />;
```

### 4. Use Consistent Action Naming

```javascript
// Pattern: RESOURCE_OPERATION_STATE
FETCH_USERS_REQUEST;
FETCH_USERS_SUCCESS;
FETCH_USERS_FAILURE;

ADD_STATION_REQUEST;
ADD_STATION_SUCCESS;
ADD_STATION_FAILURE;
```

### 5. Avoid Redux for Component State

```javascript
// ✅ Use Redux for
- User authentication
- Global app state
- Shared data between many components

// ✅ Use Local State for
- Form inputs
- UI toggles (modals, dropdowns)
- Temporary component data
```

---

## Debugging Redux

### Redux DevTools Browser Extension

1. Install Redux DevTools browser extension
2. Actions are logged in the extension
3. Time-travel debugging available
4. View state changes at each action

### Console Logging

```javascript
// In store.js
window.store = store; // Already in the project

// In browser console
store.getState(); // View entire state
store.subscribe(() => console.log(store.getState())); // Subscribe to changes
store.dispatch(action); // Dispatch actions manually
```

---

## Common Patterns

### Pattern: Async Request Handling

```javascript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

const handleAction = async () => {
  setIsLoading(true);
  try {
    await dispatch(asyncAction());
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

### Pattern: Form Submission

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(submitAction(formData));
  // formData sent to API
  // Response handled by reducer
};
```

---

For more information, see [DOCUMENTATION.md](./DOCUMENTATION.md) and [API_REFERENCE.md](./API_REFERENCE.md)
