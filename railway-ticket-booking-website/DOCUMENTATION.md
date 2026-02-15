# Railway Ticket Booking Website - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Routes & Navigation](#routes--navigation)
5. [Redux State Management](#redux-state-management)
6. [API Integration](#api-integration)
7. [Helper Functions & Hooks](#helper-functions--hooks)
8. [Authentication & Authorization](#authentication--authorization)
9. [Components Overview](#components-overview)
10. [Setup & Installation](#setup--installation)
11. [Development Workflow](#development-workflow)
12. [Best Practices](#best-practices)

---

## Project Overview

The Railway Ticket Booking Website is a full-stack web application that enables users to:

- Search for trains between stations
- View train details
- Book tickets
- Manage bookings
- Handle password reset functionality
- Admin users can manage trains, stations, routes, and bookings

### Key Features

- **User Authentication**: Sign up, Login, Forgot Password
- **Train Search**: Search trains between stations
- **Ticket Booking**: Book tickets with passenger details
- **Booking Management**: View and cancel bookings
- **Admin Dashboard**: Manage trains, stations, routes, and view all bookings
- **Role-Based Access Control**: User and Admin roles with protected routes
- **Token-Based Authentication**: JWT tokens for secure API communication
- **Error Handling**: Comprehensive error handling with user feedback

---

## Technology Stack

### Frontend

- **React 19.2.0** - UI library for building user interfaces
- **React Router DOM 7.11.0** - Routing and navigation
- **Redux 5.0.1** - State management
- **React-Redux 9.2.0** - React bindings for Redux
- **Redux-Thunk 3.1.0** - Middleware for async Redux actions
- **Axios 1.13.2** - HTTP client for API requests
- **Vite 7.2.4** - Fast build tool and dev server

### Development Tools

- **ESLint 9.39.1** - Code quality and style checking
- **React Refresh** - Fast refresh for development

---

## Project Structure

```
railway-ticket-booking-website/
├── src/
│   ├── actions/                    # Redux action creators
│   │   ├── admin.js               # Admin actions (manage trains, stations, routes, bookings)
│   │   ├── auth.js                # Authentication actions (login, signup, logout)
│   │   ├── booking.js             # Booking actions (create, cancel, fetch)
│   │   └── train.js               # Train actions (search, stations, availability)
│   │
│   ├── app/
│   │   ├── layout/
│   │   │   └── Navbar.jsx         # Navigation bar component
│   │   │
│   │   ├── pages/                 # Page components
│   │   │   ├── AdminDashboard.jsx # Admin panel for managing trains, stations, routes
│   │   │   ├── ForgotPassword.jsx # Password reset page
│   │   │   ├── Home.jsx           # Landing/home page
│   │   │   ├── Login.jsx          # User login page
│   │   │   ├── MyBookings.jsx     # User bookings management
│   │   │   ├── Register.jsx       # User registration page
│   │   │   ├── Search.jsx         # Train search page
│   │   │   ├── TrainDetails.jsx   # Train details and booking page
│   │   │   └── index.js           # Pages index file
│   │   │
│   │   └── privateRoutes/         # Protected routes
│   │       ├── AdminRoute.jsx     # Route protection for admin
│   │       └── UserRoute.jsx      # Route protection for logged-in users
│   │
│   ├── components/                # Reusable React components
│   │
│   ├── constants/
│   │   └── reducerConstants.js    # Redux action type constants
│   │
│   ├── helpers/
│   │   └── api.js                 # Axios instance with interceptors
│   │
│   ├── hooks/
│   │   └── useApi.js              # Custom hook for API requests
│   │
│   ├── reducers/                  # Redux reducers
│   │   ├── admin.js               # Admin state reducer
│   │   ├── auth.js                # Authentication state reducer
│   │   ├── booking.js             # Booking state reducer
│   │   ├── train.js               # Train state reducer
│   │   └── index.js               # Root reducer (combineReducers)
│   │
│   ├── store/
│   │   └── store.js               # Redux store configuration
│   │
│   ├── styles/                    # CSS stylesheets
│   │   ├── admin.css
│   │   ├── App.css
│   │   ├── auth.css
│   │   ├── booking.css
│   │   ├── clean-globals.css
│   │   ├── globals.css
│   │   ├── home.css
│   │   ├── index.css
│   │   ├── my-bookings.css
│   │   ├── navbar.css
│   │   ├── search.css
│   │   └── theme-modern.css
│   │
│   ├── App.jsx                    # Main App component with route definitions
│   └── main.jsx                   # React app entry point
│
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
├── vite.config.js                 # Vite configuration
├── eslint.config.js               # ESLint configuration
└── index.html                     # HTML template
```

---

## Routes & Navigation

### Route Structure

The application uses React Router v7 with the following route hierarchy:

#### Public Routes

| Route              | Component        | Description                              |
| ------------------ | ---------------- | ---------------------------------------- |
| `/`                | `Home`           | Landing page for non-authenticated users |
| `/login`           | `Login`          | User login page                          |
| `/register`        | `Register`       | User registration page                   |
| `/forgot-password` | `ForgotPassword` | Password reset page                      |

#### Protected User Routes (Requires Authentication)

Wrapped in `<UserRoute />` component - redirects to `/login` if not authenticated.

| Route          | Component      | Description                         |
| -------------- | -------------- | ----------------------------------- |
| `/search`      | `Search`       | Train search interface              |
| `/train/:id`   | `TrainDetails` | Train details and booking interface |
| `/my-bookings` | `MyBookings`   | View and manage user bookings       |

#### Protected Admin Routes (Requires Admin Role)

Wrapped in `<AdminRoute />` component - requires `auth.user.role === "ADMIN"`.

| Route              | Component        | Description          |
| ------------------ | ---------------- | -------------------- |
| `/admin`           | `AdminDashboard` | Main admin dashboard |
| `/admin/add-train` | `AdminDashboard` | Add new train        |
| `/admin/add-route` | `AdminDashboard` | Add new route        |
| `/admin/bookings`  | `AdminDashboard` | View all bookings    |

### Route Protection Implementation

**UserRoute.jsx** - Protects user routes

```jsx
- Checks if token exists in Redux auth state
- Allows access only to authenticated users
- Redirects to /login if not authenticated
```

**AdminRoute.jsx** - Protects admin routes

```jsx
- Checks if token exists AND user role is "ADMIN"
- Allows access only to admin users
- Redirects to /login if not authenticated or not admin
```

---

## Redux State Management

### Store Structure

```
store/
  ├── auth
  │   ├── token
  │   ├── userData
  │   ├── loading
  │   ├── error
  │   └── successMessage
  ├── train
  │   ├── stations
  │   ├── searchResults
  │   ├── availability
  │   ├── loading
  │   └── error
  ├── booking
  │   ├── bookings
  │   ├── currentBooking
  │   ├── loading
  │   ├── error
  │   └── successMessage
  └── admin
      ├── bookings
      ├── pagination
      ├── stations
      ├── trains
      ├── routes
      ├── loading
      ├── error
      └── successMessage
```

### Redux Middleware

- **Redux-Thunk** - Enables async action creators for API calls

### Redux Initialization

```javascript
const store = createStore(rootReducer, applyMiddleware(thunk));
```

---

## Redux Reducers & Actions

### 1. Authentication Reducer (`src/reducers/auth.js`)

**State Shape:**

```javascript
{
  token: string | null,
  userData: object | null,
  loading: boolean,
  error: string | null,
  successMessage: string | null
}
```

**Action Types & Handlers:**

| Action Type               | Handler                                      | Description               |
| ------------------------- | -------------------------------------------- | ------------------------- |
| `LOGIN_REQUEST`           | Sets `loading` to true                       | Login initiated           |
| `LOGIN_SUCCESS`           | Sets `token`, `userData`, `loading` to false | Login successful          |
| `LOGIN_FAILURE`           | Sets `error`, `loading` to false             | Login failed              |
| `SIGNUP_REQUEST`          | Sets `loading` to true                       | Signup initiated          |
| `SIGNUP_SUCCESS`          | Sets `loading` to false, `successMessage`    | Signup successful         |
| `SIGNUP_FAILURE`          | Sets `error`, `loading` to false             | Signup failed             |
| `FORGOT_PASSWORD_REQUEST` | Sets `loading` to true                       | Password reset initiated  |
| `FORGOT_PASSWORD_SUCCESS` | Sets `loading` to false, `successMessage`    | Password reset successful |
| `FORGOT_PASSWORD_FAILURE` | Sets `error`, `loading` to false             | Password reset failed     |
| `LOGOUT`                  | Clears `token`, `userData`, messages         | User logged out           |
| `CLEAR_ERROR`             | Clears `error`, `successMessage`             | Clear error messages      |

**Initial Token Setup:**

```javascript
token: localStorage.getItem("token") || null;
```

---

### 2. Train Reducer (`src/reducers/train.js`)

**State Shape:**

```javascript
{
  stations: array,
  searchResults: array,
  availability: object | null,
  loading: boolean,
  error: string | null
}
```

**Action Types & Handlers:**

| Action Type                  | Handler                                  | Description               |
| ---------------------------- | ---------------------------------------- | ------------------------- |
| `FETCH_STATIONS_REQUEST`     | Sets `loading` to true                   | Fetching stations         |
| `FETCH_STATIONS_SUCCESS`     | Sets `stations`, `loading` to false      | Stations fetched          |
| `FETCH_STATIONS_FAILURE`     | Sets `error`, `loading` to false         | Failed to fetch stations  |
| `SEARCH_TRAINS_REQUEST`      | Sets `loading` to true                   | Train search initiated    |
| `SEARCH_TRAINS_SUCCESS`      | Sets `searchResults`, `loading` to false | Trains found              |
| `SEARCH_TRAINS_FAILURE`      | Sets `error`, `loading` to false         | Search failed             |
| `CHECK_AVAILABILITY_REQUEST` | Sets `loading` to true                   | Checking availability     |
| `CHECK_AVAILABILITY_SUCCESS` | Sets `availability`, `loading` to false  | Availability checked      |
| `CHECK_AVAILABILITY_FAILURE` | Sets `error`, `loading` to false         | Availability check failed |
| `CLEAR_SEARCH_RESULTS`       | Clears `searchResults`, `availability`   | Reset search state        |

---

### 3. Booking Reducer (`src/reducers/booking.js`)

**State Shape:**

```javascript
{
  bookings: array,
  currentBooking: object | null,
  loading: boolean,
  error: string | null,
  successMessage: string | null
}
```

**Action Types & Handlers:**

| Action Type                 | Handler                                                     | Description              |
| --------------------------- | ----------------------------------------------------------- | ------------------------ |
| `BOOK_TICKET_REQUEST`       | Sets `loading` to true                                      | Booking initiated        |
| `BOOK_TICKET_SUCCESS`       | Sets `currentBooking`, `loading` to false, `successMessage` | Booking successful       |
| `BOOK_TICKET_FAILURE`       | Sets `error`, `loading` to false                            | Booking failed           |
| `FETCH_MY_BOOKINGS_REQUEST` | Sets `loading` to true                                      | Fetching bookings        |
| `FETCH_MY_BOOKINGS_SUCCESS` | Sets `bookings`, `loading` to false                         | Bookings fetched         |
| `FETCH_MY_BOOKINGS_FAILURE` | Sets `error`, `loading` to false                            | Failed to fetch bookings |
| `CANCEL_BOOKING_REQUEST`    | Sets `loading` to true                                      | Cancellation initiated   |
| `CANCEL_BOOKING_SUCCESS`    | Updates booking in `bookings` array, `successMessage`       | Booking cancelled        |
| `CANCEL_BOOKING_FAILURE`    | Sets `error`, `loading` to false                            | Cancellation failed      |
| `CLEAR_BOOKING_MESSAGE`     | Clears `error`, `successMessage`                            | Clear messages           |

---

### 4. Admin Reducer (`src/reducers/admin.js`)

**State Shape:**

```javascript
{
  bookings: array,
  pagination: object | null,
  stations: array,
  trains: array,
  routes: array,
  loading: boolean,
  error: string | null,
  successMessage: string | null
}
```

**Action Types & Handlers:**

| Action Type                  | Handler                                            | Description              |
| ---------------------------- | -------------------------------------------------- | ------------------------ |
| `FETCH_ALL_BOOKINGS_REQUEST` | Sets `loading` to true                             | Fetching all bookings    |
| `FETCH_ALL_BOOKINGS_SUCCESS` | Sets `bookings`, `pagination`, `loading` to false  | All bookings fetched     |
| `FETCH_ALL_BOOKINGS_FAILURE` | Sets `error`, `loading` to false                   | Failed to fetch bookings |
| `ADD_STATION_REQUEST`        | Sets `loading` to true                             | Adding station           |
| `ADD_STATION_SUCCESS`        | Adds station to `stations` array, `successMessage` | Station added            |
| `ADD_STATION_FAILURE`        | Sets `error`, `loading` to false                   | Failed to add station    |
| `ADD_TRAIN_REQUEST`          | Sets `loading` to true                             | Adding train             |
| `ADD_TRAIN_SUCCESS`          | Adds train to `trains` array, `successMessage`     | Train added              |
| `ADD_TRAIN_FAILURE`          | Sets `error`, `loading` to false                   | Failed to add train      |
| `ADD_ROUTE_REQUEST`          | Sets `loading` to true                             | Adding route             |
| `ADD_ROUTE_SUCCESS`          | Adds route to `routes` array, `successMessage`     | Route added              |
| `ADD_ROUTE_FAILURE`          | Sets `error`, `loading` to false                   | Failed to add route      |
| `CLEAR_ADMIN_MESSAGE`        | Clears `error`, `successMessage`                   | Clear messages           |

---

## Redux Action Creators (Async Thunks)

### Authentication Actions (`src/actions/auth.js`)

#### `login(email, password)`

```javascript
// Dispatches: LOGIN_REQUEST → LOGIN_SUCCESS or LOGIN_FAILURE
// Stores token in localStorage
// Returns: response.data with token and userData
// API: POST /auth/sign-in
```

#### `signup(name, email, phoneNo, password)`

```javascript
// Dispatches: SIGNUP_REQUEST → SIGNUP_SUCCESS or SIGNUP_FAILURE
// Returns: response.data with user information
// API: POST /auth/sign-up
```

#### `logout()`

```javascript
// Removes token from localStorage
// Dispatches: LOGOUT
```

#### `forgotPassword(email, password)`

```javascript
// Dispatches: FORGOT_PASSWORD_REQUEST → FORGOT_PASSWORD_SUCCESS or FORGOT_PASSWORD_FAILURE
// API: POST /auth/forgot-password
```

#### `clearError()`

```javascript
// Dispatches: CLEAR_ERROR to clear error and success messages
```

---

### Train Actions (`src/actions/train.js`)

#### `fetchStations()`

```javascript
// Dispatches: FETCH_STATIONS_REQUEST → FETCH_STATIONS_SUCCESS or FETCH_STATIONS_FAILURE
// API: GET /train/stations
// Returns: array of stations
```

#### `searchTrains(from, to)`

```javascript
// Dispatches: SEARCH_TRAINS_REQUEST → SEARCH_TRAINS_SUCCESS or SEARCH_TRAINS_FAILURE
// API: GET /train/search?from={from}&to={to}
// Returns: array of available trains
```

#### `checkAvailability(trainId, travelDate)`

```javascript
// Dispatches: CHECK_AVAILABILITY_REQUEST → CHECK_AVAILABILITY_SUCCESS or CHECK_AVAILABILITY_FAILURE
// API: POST /booking/check-availability
// Returns: availability data with seat information
```

#### `clearSearchResults()`

```javascript
// Dispatches: CLEAR_SEARCH_RESULTS to clear search and availability data
```

---

### Booking Actions (`src/actions/booking.js`)

#### `bookTicket(trainId, fromStationId, toStationId, travelDate, seatsBooked, passengers)`

```javascript
// Dispatches: BOOK_TICKET_REQUEST → BOOK_TICKET_SUCCESS or BOOK_TICKET_FAILURE
// API: POST /booking/create
// Request body: { trainId, fromStationId, toStationId, travelDate, seatsBooked, passengers }
// Returns: booking confirmation data
```

#### `fetchMyBookings()`

```javascript
// Dispatches: FETCH_MY_BOOKINGS_REQUEST → FETCH_MY_BOOKINGS_SUCCESS or FETCH_MY_BOOKINGS_FAILURE
// API: GET /booking/my-bookings (authenticated)
// Returns: array of user's bookings
```

#### `cancelBooking(bookingId)`

```javascript
// Dispatches: CANCEL_BOOKING_REQUEST → CANCEL_BOOKING_SUCCESS or CANCEL_BOOKING_FAILURE
// API: POST /booking/cancel/{bookingId} (authenticated)
// Returns: updated booking data with cancelled status
```

#### `clearBookingMessage()`

```javascript
// Dispatches: CLEAR_BOOKING_MESSAGE to clear messages
```

---

### Admin Actions (`src/actions/admin.js`)

#### `fetchAllBookings(page = 1, limit = 10)`

```javascript
// Dispatches: FETCH_ALL_BOOKINGS_REQUEST → FETCH_ALL_BOOKINGS_SUCCESS or FETCH_ALL_BOOKINGS_FAILURE
// API: GET /admin/bookings?page={page}&limit={limit} (admin only)
// Returns: { data: [bookings], pagination: {page, limit, total} }
```

#### `addStation(name, code)`

```javascript
// Dispatches: ADD_STATION_REQUEST → ADD_STATION_SUCCESS or ADD_STATION_FAILURE
// API: POST /admin/add-station (admin only)
// Request body: { name, code }
// Returns: created station object
```

#### `addTrain(trainNumber, trainName, totalSeats)`

```javascript
// Dispatches: ADD_TRAIN_REQUEST → ADD_TRAIN_SUCCESS or ADD_TRAIN_FAILURE
// API: POST /admin/add-train (admin only)
// Request body: { trainNumber, trainName, totalSeats }
// Returns: created train object
```

#### `addRoute(trainId, stops)`

```javascript
// Dispatches: ADD_ROUTE_REQUEST → ADD_ROUTE_SUCCESS or ADD_ROUTE_FAILURE
// API: POST /admin/add-route (admin only)
// Request body: { trainId, stops }
// Returns: created route object
```

#### `clearAdminMessage()`

```javascript
// Dispatches: CLEAR_ADMIN_MESSAGE to clear messages
```

---

## API Integration

### Axios Configuration (`src/helpers/api.js`)

**Base Setup:**

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
```

**Request Interceptor:**

```javascript
- Automatically adds Authorization header with JWT token from localStorage
- Format: Authorization: Bearer {token}
```

**Response Interceptor:**

```javascript
- Handles 401 Unauthorized: Removes token and redirects to /login
- Handles 403 Forbidden: Logs error message
- Forwards all other errors to callers
```

### API Endpoints Reference

#### Authentication Endpoints

```
POST   /auth/sign-in           - User login
POST   /auth/sign-up           - User registration
POST   /auth/forgot-password   - Password reset
```

#### Train Endpoints

```
GET    /train/stations         - Fetch all stations
GET    /train/search           - Search trains (params: from, to)
```

#### Booking Endpoints

```
POST   /booking/check-availability  - Check seat availability
POST   /booking/create              - Create new booking
GET    /booking/my-bookings         - Get user's bookings (authenticated)
POST   /booking/cancel/{bookingId}  - Cancel booking (authenticated)
```

#### Admin Endpoints

```
GET    /admin/bookings              - Get all bookings with pagination (admin)
POST   /admin/add-station           - Add new station (admin)
POST   /admin/add-train             - Add new train (admin)
POST   /admin/add-route             - Add new route (admin)
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## Helper Functions & Hooks

### Custom Hook: `useApi` (`src/hooks/useApi.js`)

A custom hook for making API requests with built-in loading and error handling.

**Hook Signature:**

```javascript
const { loading, error, get, post, put, patch, delete: del } = useApi();
```

**Properties:**

| Property  | Type     | Description                  |
| --------- | -------- | ---------------------------- | ------------------------------ |
| `loading` | boolean  | Loading state during request |
| `error`   | string   | null                         | Error message if request fails |
| `get`     | function | Make GET request             |
| `post`    | function | Make POST request            |
| `put`     | function | Make PUT request             |
| `patch`   | function | Make PATCH request           |
| `delete`  | function | Make DELETE request          |

**Usage Example:**

```javascript
import useApi from "../hooks/useApi";

function MyComponent() {
  const { loading, error, get, post } = useApi();

  const fetchData = async () => {
    try {
      const data = await get("/train/stations");
      console.log(data);
    } catch (err) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

### API Helper (`src/helpers/api.js`)

The Axios instance with pre-configured interceptors.

**Direct Usage:**

```javascript
import api from "../helpers/api";

// Simple GET request
api
  .get("/train/stations")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));

// POST request with data
api
  .post("/auth/sign-in", { email, password })
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```

---

## Authentication & Authorization

### Login Flow

1. User enters email and password on Login page
2. `login(email, password)` action creator is dispatched
3. Axios POST request to `/auth/sign-in`
4. On success:
   - JWT token stored in localStorage
   - Token stored in Redux auth.token
   - User data stored in Redux auth.userData
   - Redirect to search page
5. On failure:
   - Error message displayed from Redux auth.error

### Session Persistence

```javascript
// Token is persisted in localStorage
const initialState = {
  token: localStorage.getItem("token") || null,
  // ...
};
```

### Token Expiration Handling

When API returns 401 status:

```javascript
// Response interceptor in api.js
if (error.response?.status === 401) {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
```

### Role-Based Access Control

**Admin Check:**

```javascript
// AdminRoute.jsx
auth.token && auth.user?.role === "ADMIN";
```

**User Check:**

```javascript
// UserRoute.jsx
auth.token;
```

### Token in API Requests

The request interceptor automatically adds the token to all requests:

```javascript
config.headers.Authorization = `Bearer ${token}`;
```

---

## Components Overview

### Layout Components

#### `Navbar.jsx`

- Displays navigation menu
- Shows user status (logged in/out)
- Links to different sections
- Logout functionality

### Page Components

#### `Home.jsx`

- Landing page for non-authenticated users
- Displays welcome information
- Links to login/register

#### `Login.jsx`

- User login form
- Email and password input
- Error display
- Link to register and forgot password
- Dispatches `login` action

#### `Register.jsx`

- User registration form
- Name, email, phone number, password inputs
- Email validation
- Dispatches `signup` action

#### `ForgotPassword.jsx`

- Password reset form
- Email input
- New password input
- Dispatches `forgotPassword` action

#### `Search.jsx`

- Train search interface
- From/To station selection
- Travel date picker
- Displays search results
- Dispatches `fetchStations` and `searchTrains` actions

#### `TrainDetails.jsx`

- Displays selected train information
- Shows available seats
- Passenger detail form
- Booking button
- Dispatches `checkAvailability` and `bookTicket` actions

#### `MyBookings.jsx`

- Shows user's bookings list
- Cancel booking functionality
- Booking status display
- Dispatches `fetchMyBookings` and `cancelBooking` actions

#### `AdminDashboard.jsx`

- Admin panel for managing system
- Add train form
- Add station form
- Add route form
- View all bookings with pagination
- Dispatches admin actions

---

## Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd railway-ticket-booking-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   # Create .env file in project root
   echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Available npm Scripts

```json
{
  "dev": "vite", // Start development server
  "build": "vite build", // Build for production
  "lint": "eslint .", // Run ESLint
  "preview": "vite preview" // Preview production build
}
```

---

## Development Workflow

### Adding a New Feature

1. **Create Action Types** (`src/actions/featureName.js`)

   ```javascript
   export const FEATURE_REQUEST = "FEATURE_REQUEST";
   export const FEATURE_SUCCESS = "FEATURE_SUCCESS";
   export const FEATURE_FAILURE = "FEATURE_FAILURE";
   ```

2. **Create Action Creator**

   ```javascript
   export const featureAction = (params) => async (dispatch) => {
     dispatch({ type: FEATURE_REQUEST });
     try {
       const response = await api.post("/endpoint", params);
       dispatch({
         type: FEATURE_SUCCESS,
         payload: response.data,
       });
     } catch (error) {
       dispatch({
         type: FEATURE_FAILURE,
         payload: error.response?.data?.error,
       });
       throw error;
     }
   };
   ```

3. **Create/Update Reducer** (`src/reducers/featureName.js`)

   ```javascript
   const featureReducer = (state = initialState, action) => {
     switch (action.type) {
       case FEATURE_REQUEST:
         return { ...state, loading: true, error: null };
       case FEATURE_SUCCESS:
         return { ...state, loading: false, data: action.payload };
       case FEATURE_FAILURE:
         return { ...state, loading: false, error: action.payload };
       default:
         return state;
     }
   };
   ```

4. **Update Root Reducer** (if creating new reducer)

   ```javascript
   // src/reducers/index.js
   import featureReducer from "./featureName";

   const rootReducer = combineReducers({
     // ... existing reducers
     feature: featureReducer,
   });
   ```

5. **Create/Update Component**

   ```jsx
   import { useDispatch, useSelector } from "react-redux";
   import { featureAction } from "../actions/featureName";

   function MyComponent() {
     const dispatch = useDispatch();
     const { loading, error, data } = useSelector((state) => state.feature);

     const handleClick = () => {
       dispatch(featureAction(params));
     };

     return (
       <>
         {loading && <p>Loading...</p>}
         {error && <p>{error}</p>}
         {data && <div>{data}</div>}
         <button onClick={handleClick}>Action</button>
       </>
     );
   }
   ```

### API Development Tips

1. **Always use Redux actions** for API calls (not direct axios calls)
2. **Handle loading and error states** in your components
3. **Use the useApi hook** for non-Redux API calls if needed
4. **Test error scenarios** (401, 403, 500, network errors)
5. **Add proper error messages** for user feedback

---

## Best Practices

### Redux Best Practices

1. **Keep reducers pure** - Don't mutate state, return new objects
2. **Use action creators** - Centralize all side effects in action creators
3. **Handle loading states** - Show loading indicators to users
4. **Normalize error messages** - Display user-friendly error messages
5. **Avoid props drilling** - Use Redux for deeply nested state

### Code Organization

1. **One action type per operation** - Clear naming conventions
2. **Consistent state shapes** - Each reducer should have consistent structure
3. **Separate concerns** - Keep components, actions, and reducers separate
4. **Reusable components** - Create components that can be used in multiple places

### Performance Optimization

1. **Use useSelector carefully** - Can cause unnecessary re-renders
2. **Memoize components** - Use React.memo for expensive components
3. **Lazy load routes** - Use React.lazy for code splitting
4. **Optimize API calls** - Avoid duplicate requests

### Security Best Practices

1. **Never store sensitive data** in localStorage except tokens
2. **Use HTTPS in production** - Ensure secure data transmission
3. **Validate all inputs** - Both frontend and backend validation
4. **Handle token expiration** - Gracefully handle expired tokens
5. **Implement CORS** - Configure CORS properly on backend

### Error Handling

1. **Catch all promise rejections** - Prevent unhandled rejections
2. **Display user-friendly messages** - Don't expose technical errors
3. **Log errors** - Use console for debugging in development
4. **Provide recovery options** - Allow users to retry failed actions

---

## File Navigation Guide

### To understand the flow:

1. Start with `src/App.jsx` - See all routes
2. Check `src/store/store.js` - Understand Redux setup
3. Review `src/reducers/index.js` - See state structure
4. Explore specific actions (e.g., `src/actions/auth.js`)
5. Check corresponding reducers
6. Look at page components (e.g., `src/app/pages/Login.jsx`)

### To add a new API endpoint:

1. Create action in appropriate file (`src/actions/`)
2. Add action types at the top of the action file
3. Create API call with error handling
4. Update or create reducer
5. Use in component with Redux hooks

---

## Troubleshooting

### Common Issues

**"Cannot read property of undefined" in Redux**

- Check if the reducer is properly combined in `src/reducers/index.js`
- Verify the state path in `useSelector`

**"Token not included in API request"**

- Ensure token is stored in `localStorage.setItem("token", ...)`
- Check request interceptor in `src/helpers/api.js`

**"401 Unauthorized redirecting to login"**

- Token might be expired
- Check backend token validation
- Verify token format (Bearer token)

**Routes not working**

- Ensure all components are imported in `src/App.jsx`
- Check route paths match exactly
- Verify private route components

---

## Support & Documentation

For more information about the technologies used:

- [React Documentation](https://react.dev)
- [Redux Documentation](https://redux.js.org)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Documentation](https://vitejs.dev)

---

**Last Updated:** February 2026
**Version:** 1.0.0
