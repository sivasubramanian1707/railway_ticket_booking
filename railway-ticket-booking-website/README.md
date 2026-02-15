# Railway Ticket Booking Website - Complete Documentation

A modern, full-stack React web application for searching, booking, and managing railway tickets with role-based admin functionality.

## 🎯 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd railway-ticket-booking-website

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📋 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🏗️ Architecture Overview

### Technology Stack

- **Frontend Framework:** React 19.2.0
- **State Management:** Redux + Redux-Thunk
- **Routing:** React Router DOM 7.11.0
- **HTTP Client:** Axios 1.13.2
- **Build Tool:** Vite 7.2.4
- **Code Quality:** ESLint 9.39.1

### Project Structure

```
src/
├── actions/          # Redux async actions & thunks
├── app/
│   ├── layout/       # Layout components (Navbar)
│   ├── pages/        # Page components
│   └── privateRoutes/ # Protected route wrappers
├── components/       # Reusable components
├── helpers/          # API configuration
├── hooks/            # Custom hooks (useApi)
├── reducers/         # Redux reducers
├── store/            # Redux store setup
├── styles/           # CSS stylesheets
├── App.jsx           # Main app with routes
└── main.jsx          # Entry point
```

## 🚀 Key Features

### User Features

- ✅ User Registration & Login
- ✅ Forgot Password functionality
- ✅ Search trains between stations
- ✅ View detailed train information
- ✅ Book tickets with multiple passengers
- ✅ Manage bookings (view & cancel)
- ✅ Session persistence with JWT tokens

### Admin Features

- ✅ Admin Dashboard
- ✅ Add new trains
- ✅ Add stations
- ✅ Configure train routes
- ✅ View all bookings with pagination
- ✅ Role-based access control

## 🗺️ Routes

### Public Routes

- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Password reset

### Protected User Routes

- `/search` - Train search
- `/train/:id` - Train details & booking
- `/my-bookings` - User's bookings

### Protected Admin Routes

- `/admin` - Admin dashboard
- `/admin/add-train` - Add train
- `/admin/add-route` - Add route
- `/admin/bookings` - View all bookings

## 🔐 Authentication & Authorization

### JWT Token Flow

1. User login → Backend returns JWT token
2. Token stored in localStorage and Redux state
3. Token automatically included in all API requests via interceptor
4. Token validation: 401 redirects to login, token refresh handled

### Role-Based Access

- **User Routes:** Protected by `UserRoute` component (requires token)
- **Admin Routes:** Protected by `AdminRoute` component (requires token + role === "ADMIN")

## 📱 Redux State Management

### State Structure

```javascript
{
  auth: {
    token,               // JWT token
    userData,            // User information
    loading,             // Request loading state
    error,               // Error messages
    successMessage       // Success notifications
  },
  train: {
    stations,            // Available stations
    searchResults,       // Search results
    availability,        // Seat availability
    loading,
    error
  },
  booking: {
    bookings,            // User's bookings
    currentBooking,      // Currently created booking
    loading,
    error,
    successMessage
  },
  admin: {
    bookings,            // All bookings (paginated)
    pagination,          // Pagination info
    stations,            // Managed stations
    trains,              // Managed trains
    routes,              // Managed routes
    loading,
    error,
    successMessage
  }
}
```

## 🔧 Redux Actions

### Authentication Actions

```javascript
dispatch(login(email, password));
dispatch(signup(name, email, phoneNo, password));
dispatch(forgotPassword(email, password));
dispatch(logout());
dispatch(clearError());
```

### Train Actions

```javascript
dispatch(fetchStations());
dispatch(searchTrains(from, to));
dispatch(checkAvailability(trainId, travelDate));
dispatch(clearSearchResults());
```

### Booking Actions

```javascript
dispatch(
  bookTicket(
    trainId,
    fromStationId,
    toStationId,
    travelDate,
    seatsBooked,
    passengers,
  ),
);
dispatch(fetchMyBookings());
dispatch(cancelBooking(bookingId));
dispatch(clearBookingMessage());
```

### Admin Actions

```javascript
dispatch(fetchAllBookings(page, limit));
dispatch(addStation(name, code));
dispatch(addTrain(trainNumber, trainName, totalSeats));
dispatch(addRoute(trainId, stops));
dispatch(clearAdminMessage());
```

## 🌐 API Integration

### Axios Configuration

- Base URL: `http://localhost:4000/api` (configurable via ENV)
- Auto-includes JWT token in Authorization header
- Auto-handles 401 errors (redirects to login)
- 10-second request timeout

### API Endpoints

**Authentication**

- `POST /auth/sign-in` - User login
- `POST /auth/sign-up` - User registration
- `POST /auth/forgot-password` - Password reset

**Trains**

- `GET /train/stations` - Get all stations
- `GET /train/search` - Search trains (params: from, to)

**Bookings**

- `POST /booking/check-availability` - Check seat availability
- `POST /booking/create` - Create booking
- `GET /booking/my-bookings` - Get user bookings
- `POST /booking/cancel/:bookingId` - Cancel booking

**Admin**

- `GET /admin/bookings` - Get all bookings (with pagination)
- `POST /admin/add-station` - Add station
- `POST /admin/add-train` - Add train
- `POST /admin/add-route` - Add route

## 🪝 Custom Hooks

### useApi Hook

Custom hook for making API requests with loading and error handling:

```javascript
import { useApi } from "../hooks/useApi";

function MyComponent() {
  const { loading, error, get, post, put, delete: del } = useApi();

  const fetchData = async () => {
    try {
      const response = await get("/train/stations");
      console.log(response);
    } catch (err) {
      console.error(error);
    }
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <button onClick={fetchData}>Fetch</button>
    </>
  );
}
```

## 💾 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## 📚 Documentation

For comprehensive documentation including:

- Complete Redux flow
- Detailed API endpoints
- Component architecture
- Development workflows
- Best practices
- Troubleshooting guide

See [DOCUMENTATION.md](./DOCUMENTATION.md)

## 👨‍💻 Development Workflow

### Adding a New Feature

1. **Create Redux Actions** (`src/actions/featureName.js`)
   - Define action types
   - Create async thunk with API call

2. **Create Reducer** (`src/reducers/featureName.js`)
   - Handle REQUEST, SUCCESS, FAILURE states
   - Manage state shape

3. **Combine Reducer** (in `src/reducers/index.js`)
   - Add to root reducer if new

4. **Create Component**
   - Use `useDispatch` and `useSelector`
   - Dispatch actions
   - Render loading/error/data states

### Code Examples

**Dispatching an action:**

```jsx
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/auth';

function LoginComponent() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const handleLogin = (email, password) => {
    dispatch(login(email, password));
  };

  return (
    // Your JSX
  );
}
```

**Making API calls:**

```jsx
import { useApi } from "../hooks/useApi";

function DataComponent() {
  const { loading, error, get } = useApi();

  const handleFetch = async () => {
    const data = await get("/endpoint");
  };
}
```

## ✅ Best Practices

### Redux

- Keep reducers pure (no mutations)
- Use action creators for all state changes
- Handle loading and error states
- Normalize API response data when possible

### Components

- Use Redux for global state management
- Use local state for component-specific data
- Keep components focused and reusable
- Handle error cases gracefully

### Performance

- Prevent unnecessary re-renders with proper selectors
- Lazy load routes
- Memoize expensive components
- Optimize API calls

### Security

- Never store passwords in state/storage
- Validate all user inputs
- Use HTTPS in production
- Handle token expiration properly

## 🐛 Troubleshooting

### Token not included in requests

- Verify token is in localStorage
- Check request interceptor in `src/helpers/api.js`
- Ensure login was successful

### Routes not accessible

- Verify user is logged in
- Check admin status for admin routes
- Verify route paths in `App.jsx`

### State not updating

- Ensure reducer is in root reducer
- Check action type names match
- Verify dispatch is called correctly

### API errors

- Check backend server is running
- Verify API_BASE_URL in .env
- Check network tab in dev tools

## 📦 Dependencies

### Production

- axios - HTTP client
- react - UI library
- react-dom - React DOM rendering
- react-redux - Redux React bindings
- react-router-dom - Routing library
- redux - State management
- redux-thunk - Async middleware

### Development

- @vitejs/plugin-react - Vite React plugin
- eslint - Code quality
- vite - Build tool

## 📝 License

This project is proprietary and confidential.

## 👥 Team

**Developed as:** Railway Ticket Booking System v1.0

---

# 📚 COMPREHENSIVE DOCUMENTATION

## Table of Contents

1. [Project Overview](#project-overview-1)
2. [Technology Stack](#comprehensive-technology-stack)
3. [Complete Project Structure](#complete-project-structure)
4. [Routes & Navigation](#routes--navigation-comprehensive)
5. [Redux State Management Deep Dive](#redux-state-management-deep-dive)
6. [API Reference](#api-reference-complete)
7. [Redux Architecture](#redux-architecture-guide)
8. [File Navigation Guide](#file-navigation-guide)
9. [Best Practices](#best-practices-comprehensive)
10. [Development Tips](#development-tips)

---

## Project Overview 1

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

## Comprehensive Technology Stack

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

## Complete Project Structure

```
railway-ticket-booking-website/
│
├── 📄 package.json              # npm dependencies and scripts
├── 📄 vite.config.js            # Vite build configuration
├── 📄 eslint.config.js          # ESLint rules
├── 📄 index.html                # HTML entry point
├── 📄 .env                       # Environment variables
├── 📄 .gitignore                # Git ignore rules
│
├── 📁 public/                   # Static assets
│
├── 📁 src/                      # Source code root
│   │
│   ├── 📄 main.jsx              # React app entry point
│   ├── 📄 App.jsx               # Main App component & routes
│   │
│   ├── 📁 actions/              # Redux action creators
│   │   ├── auth.js              # Authentication actions
│   │   ├── booking.js           # Booking actions
│   │   ├── train.js             # Train search actions
│   │   └── admin.js             # Admin panel actions
│   │
│   ├── 📁 app/                  # Application pages & layout
│   │   ├── 📁 layout/
│   │   │   └── Navbar.jsx       # Navigation bar component
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx         # Home/landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Search.jsx       # Train search page
│   │   │   ├── TrainDetails.jsx # Train details page
│   │   │   ├── MyBookings.jsx   # User bookings page
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── index.js         # Pages barrel export
│   │   │
│   │   └── 📁 privateRoutes/
│   │       ├── UserRoute.jsx    # Protected user routes
│   │       └── AdminRoute.jsx   # Protected admin routes
│   │
│   ├── 📁 components/           # Reusable UI components
│   ├── 📁 constants/
│   │   └── reducerConstants.js  # Redux action type constants
│   ├── 📁 helpers/
│   │   └── api.js               # Axios instance with interceptors
│   ├── 📁 hooks/
│   │   └── useApi.js            # Custom API hook
│   ├── 📁 reducers/             # Redux reducers
│   │   ├── auth.js
│   │   ├── booking.js
│   │   ├── train.js
│   │   ├── admin.js
│   │   └── index.js
│   ├── 📁 store/
│   │   └── store.js             # Redux store configuration
│   ├── 📁 styles/               # CSS stylesheets
│   └── 📁 assets/               # Images, icons, fonts
```

---

## Routes & Navigation Comprehensive

### Route Structure

| Route              | Component      | Type              | Description             |
| ------------------ | -------------- | ----------------- | ----------------------- |
| `/`                | Home           | Public            | Landing page            |
| `/login`           | Login          | Public            | User login              |
| `/register`        | Register       | Public            | User registration       |
| `/forgot-password` | ForgotPassword | Public            | Password reset          |
| `/search`          | Search         | Protected (User)  | Train search            |
| `/train/:id`       | TrainDetails   | Protected (User)  | Train details & booking |
| `/my-bookings`     | MyBookings     | Protected (User)  | Manage bookings         |
| `/admin`           | AdminDashboard | Protected (Admin) | Admin dashboard         |
| `/admin/add-train` | AdminDashboard | Protected (Admin) | Add train               |
| `/admin/add-route` | AdminDashboard | Protected (Admin) | Add route               |
| `/admin/bookings`  | AdminDashboard | Protected (Admin) | View all bookings       |

### Protected Routes Implementation

**UserRoute.jsx** - Checks if token exists, redirects to /login if not
**AdminRoute.jsx** - Checks token AND role === "ADMIN", redirects to /login if not

---

## Redux State Management Deep Dive

### Complete State Structure

```javascript
{
  auth: {
    token: string | null,
    userData: { _id, name, email, role, ... } | null,
    loading: boolean,
    error: string | null,
    successMessage: string | null
  },
  train: {
    stations: [{ _id, name, code }, ...],
    searchResults: [{ _id, trainNumber, trainName, totalSeats, ... }, ...],
    availability: { trainId, totalSeats, bookedSeats, availableSeats, ... } | null,
    loading: boolean,
    error: string | null
  },
  booking: {
    bookings: [{ _id, userId, trainId, travelDate, status, ... }, ...],
    currentBooking: { _id, bookingDetails, ... } | null,
    loading: boolean,
    error: string | null,
    successMessage: string | null
  },
  admin: {
    bookings: [{ full booking objects }],
    pagination: { total, page, limit, pages },
    stations: [{ station objects }],
    trains: [{ train objects }],
    routes: [{ route objects }],
    loading: boolean,
    error: string | null,
    successMessage: string | null
  }
}
```

### Redux Reducers

#### Authentication Reducer (`src/reducers/auth.js`)

Manages user login, registration, and token persistence. Token is automatically loaded from localStorage on app startup.

**Handles Actions:**

- LOGIN_REQUEST/SUCCESS/FAILURE
- SIGNUP_REQUEST/SUCCESS/FAILURE
- FORGOT_PASSWORD_REQUEST/SUCCESS/FAILURE
- LOGOUT
- CLEAR_ERROR

#### Train Reducer (`src/reducers/train.js`)

Manages stations list, train search results, and seat availability.

**Handles Actions:**

- FETCH_STATIONS_REQUEST/SUCCESS/FAILURE
- SEARCH_TRAINS_REQUEST/SUCCESS/FAILURE
- CHECK_AVAILABILITY_REQUEST/SUCCESS/FAILURE
- CLEAR_SEARCH_RESULTS

#### Booking Reducer (`src/reducers/booking.js`)

Manages user bookings, current booking, and booking operations.

**Handles Actions:**

- BOOK_TICKET_REQUEST/SUCCESS/FAILURE
- FETCH_MY_BOOKINGS_REQUEST/SUCCESS/FAILURE
- CANCEL_BOOKING_REQUEST/SUCCESS/FAILURE
- CLEAR_BOOKING_MESSAGE

#### Admin Reducer (`src/reducers/admin.js`)

Manages admin operations: fetching all bookings, adding stations/trains/routes.

**Handles Actions:**

- FETCH_ALL_BOOKINGS_REQUEST/SUCCESS/FAILURE
- ADD_STATION_REQUEST/SUCCESS/FAILURE
- ADD_TRAIN_REQUEST/SUCCESS/FAILURE
- ADD_ROUTE_REQUEST/SUCCESS/FAILURE
- CLEAR_ADMIN_MESSAGE

---

## API Reference Complete

### Base Configuration

**Base URL:** `http://localhost:4000/api` (configurable via `VITE_API_BASE_URL`)

**Request Interceptor:**

- Automatically adds `Authorization: Bearer {token}` header
- Token retrieved from localStorage if exists

**Response Interceptor:**

- 401 Unauthorized: Removes token, redirects to /login
- 403 Forbidden: Logs error message
- Other errors: Passed to error handler

---

### Auth Endpoints

#### POST /auth/sign-in - User Login

```javascript
// Request
{ email: string, password: string }

// Response (200)
{
  token: string,
  userData: { _id, name, email, phoneNo, role, createdAt, updatedAt }
}

// Error (401/400)
{ errorMessage: string }
```

**Redux Action:** `login(email, password)`

---

#### POST /auth/sign-up - User Registration

```javascript
// Request
{ name: string, email: string, phoneNo: string, password: string }

// Response (201)
{ user: { _id, name, email, phoneNo, role: "USER", ... } }

// Error (400/409)
{ errorMessage: string }
```

**Redux Action:** `signup(name, email, phoneNo, password)`

---

#### POST /auth/forgot-password - Password Reset

```javascript
// Request
{ email: string, password: string }

// Response (200)
{ message: string }

// Error (404/400)
{ errorMessage: string }
```

**Redux Action:** `forgotPassword(email, password)`

---

### Train Endpoints

#### GET /train/stations - Get All Stations

```javascript
// Response (200)
[
  { _id: string, name: string, code: string, createdAt, updatedAt },
  ...
]

// Error (500)
{ error: string }
```

**Redux Action:** `fetchStations()`

---

#### GET /train/search - Search Trains

```javascript
// Query Params
?from=STATIONID&to=STATIONID

// Response (200)
{
  trains: [
    {
      _id: string,
      trainNumber: string,
      trainName: string,
      totalSeats: number,
      fromStation: { _id, name, code },
      toStation: { _id, name, code },
      ...
    }
  ]
}

// Error (400/500)
{ message: string }
```

**Redux Action:** `searchTrains(from, to)`

---

### Booking Endpoints

#### POST /booking/check-availability - Check Seat Availability

```javascript
// Request
{
  trainId: string,
  travelDate: string (ISO format)
}

// Response (200)
{
  trainId: string,
  travelDate: string,
  totalSeats: number,
  bookedSeats: number,
  availableSeats: number
}

// Error (400/404)
{ message: string }
```

**Redux Action:** `checkAvailability(trainId, travelDate)`

---

#### POST /booking/create - Create Booking

**Authentication Required:** Yes (User must be logged in)

```javascript
// Request
{
  trainId: string,
  fromStationId: string,
  toStationId: string,
  travelDate: string,
  seatsBooked: number,
  passengers: [
    { name, age, gender, seatNumber },
    ...
  ]
}

// Response (201)
{
  _id: string,
  userId: string,
  trainId: string,
  travelDate: string,
  seatsBooked: number,
  seatNumbers: [number],
  passengers: [object],
  bookingStatus: "CONFIRMED",
  totalPrice: number,
  createdAt: string,
  updatedAt: string
}

// Error (400/401/409)
{ error: string }
```

**Redux Action:** `bookTicket(trainId, fromStationId, toStationId, travelDate, seatsBooked, passengers)`

---

#### GET /booking/my-bookings - Get User's Bookings

**Authentication Required:** Yes

```javascript
// Response (200)
[
  {
    _id: string,
    userId: string,
    trainId: string,
    travelDate: string,
    seatsBooked: number,
    bookingStatus: "CONFIRMED" | "CANCELLED" | "PENDING",
    totalPrice: number,
    createdAt: string,
    updatedAt: string
  },
  ...
]

// Error (401/500)
{ error: string }
```

**Redux Action:** `fetchMyBookings()`

---

#### POST /booking/cancel/:bookingId - Cancel Booking

**Authentication Required:** Yes

```javascript
// Response (200)
{
  _id: string,
  bookingStatus: "CANCELLED",
  cancelledAt: string
}

// Error (404/400/401)
{ error: string }
```

**Redux Action:** `cancelBooking(bookingId)`

---

### Admin Endpoints

#### GET /admin/bookings - Get All Bookings (Paginated)

**Authentication Required:** Yes (Admin only)

```javascript
// Query Params
?page=1&limit=10

// Response (200)
{
  data: [{ full booking objects }],
  pagination: {
    total: number,
    page: number,
    limit: number,
    pages: number
  }
}

// Error (401/403/500)
{ error: string }
```

**Redux Action:** `fetchAllBookings(page, limit)`

---

#### POST /admin/add-station - Add Station

**Authentication Required:** Yes (Admin only)

```javascript
// Request
{ name: string, code: string }

// Response (201)
{ station: { _id, name, code, createdAt, updatedAt } }

// Error (400/409)
{ errorMessage: string }
```

**Redux Action:** `addStation(name, code)`

---

#### POST /admin/add-train - Add Train

**Authentication Required:** Yes (Admin only)

```javascript
// Request
{ trainNumber: string, trainName: string, totalSeats: number }

// Response (201)
{ train: { _id, trainNumber, trainName, totalSeats, ... } }

// Error (400/409)
{ errorMessage: string }
```

**Redux Action:** `addTrain(trainNumber, trainName, totalSeats)`

---

#### POST /admin/add-route - Add Route

**Authentication Required:** Yes (Admin only)

```javascript
// Request
{
  trainId: string,
  stops: [
    { stationId, stopOrder, arrivalTime, departureTime },
    ...
  ]
}

// Response (201)
{ route: { _id, trainId, stops, ... } }

// Error (400/404)
{ errorMessage: string }
```

**Redux Action:** `addRoute(trainId, stops)`

---

## Redux Architecture Guide

### Redux Core Concepts

**Store** - Single object holding entire application state
**Actions** - Objects describing what happened (must have type property)
**Reducers** - Pure functions taking current state and action, returning new state
**Dispatch** - Function to send actions to store
**Selectors** - Functions extracting data from store state

### How Redux Works in This App

1. **User Action** (e.g., click login button)
2. **Component Dispatches Action** `dispatch(login(email, password))`
3. **Redux-Thunk Middleware** intercepts function action
4. **Action Creator** executes:
   - Dispatches REQUEST action (sets loading: true)
   - Makes API call
   - On success: Dispatches SUCCESS action with data
   - On failure: Dispatches FAILURE action with error
5. **Reducer** processes action and returns new state
6. **Store Updated** - all subscribers notified
7. **Component Re-renders** - useSelector picks new state

### Redux Thunks Explained

A thunk is a function that returns a function. Used for async operations:

```javascript
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const response = await api.post("/auth/sign-in", { email, password });
    localStorage.setItem("token", response.data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token: response.data.token, userData: response.data.userData },
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload: error.response?.data?.errorMessage || "Login failed",
    });
    throw error;
  }
};
```

### Using Redux in Components

```javascript
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth";

function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);

  const handleLogin = async (email, password) => {
    try {
      await dispatch(login(email, password));
      // Navigate or show success
    } catch (err) {
      // Error is already in Redux state
      console.error(error);
    }
  };

  return (
    <form onSubmit={() => handleLogin(email, password)}>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {/* Form fields */}
    </form>
  );
}
```

---

## File Navigation Guide

### To understand the data flow:

1. Start with `src/App.jsx` - See all routes
2. Check `src/store/store.js` - Understand Redux setup
3. Review `src/reducers/index.js` - See state structure
4. Explore specific actions (e.g., `src/actions/auth.js`)
5. Check corresponding reducers
6. Look at page components

### To add a new API endpoint:

1. Create action in `src/actions/`
2. Add action types at top of action file
3. Create API call with error handling
4. Update or create reducer in `src/reducers/`
5. Use in component with Redux hooks

### File Size Reference

| File                     | Typical Size  |
| ------------------------ | ------------- |
| Simple reducer           | 100-300 lines |
| Action file (3-4 thunks) | 200-400 lines |
| Page component           | 200-500 lines |
| Utility component        | 50-150 lines  |
| Custom hook              | 50-100 lines  |
| API helper               | 30-50 lines   |

---

## Best Practices Comprehensive

### Redux Best Practices

✅ Keep reducers pure - Don't mutate state, return new objects
✅ Use action creators - Centralize all side effects in action creators
✅ Handle loading and error states - Show loading indicators to users
✅ Normalize error messages - Display user-friendly error messages
✅ Avoid props drilling - Use Redux for deeply nested state
✅ Don't put everything in Redux - Local state for component-specific data

### Code Organization

✅ One action type per operation - Clear naming conventions
✅ Consistent state shapes - Each reducer should have consistent structure
✅ Separate concerns - Keep components, actions, and reducers separate
✅ Reusable components - Create components that can be used in multiple places

### Performance Optimization

✅ Use useSelector carefully - Can cause unnecessary re-renders
✅ Memoize components - Use React.memo for expensive components
✅ Lazy load routes - Use React.lazy for code splitting
✅ Optimize API calls - Avoid duplicate requests

### Security Best Practices

✅ Never store sensitive data - Only store tokens in localStorage (encrypted if possible)
✅ Use HTTPS in production - Ensure secure data transmission
✅ Validate all inputs - Both frontend and backend validation
✅ Handle token expiration - Gracefully handle expired tokens
✅ Implement CORS - Configure CORS properly on backend

### Error Handling

✅ Catch all promise rejections - Prevent unhandled rejections
✅ Display user-friendly messages - Don't expose technical errors
✅ Log errors - Use console for debugging in development
✅ Provide recovery options - Allow users to retry failed actions

---

## Development Tips

### Debugging Redux

1. **Install Redux DevTools** browser extension
2. **Actions are logged** in the extension
3. **Time-travel debugging** available
4. **View state changes** at each action

### Console Debugging

```javascript
// In browser console
window.store.getState(); // View entire state
store.dispatch(action); // Dispatch actions manually
```

### Common Patterns

**Loading Spinner Pattern:**

```jsx
{
  loading && <LoadingSpinner />;
}
{
  error && <ErrorMessage message={error} />;
}
{
  data && <DataDisplay data={data} />;
}
```

**Form Submission Pattern:**

```javascript
const handleSubmit = (e) => {
  e.preventDefault();
  dispatch(submitAction(formData));
};
```

---

## Environment Variables

Create a `.env` file in project root:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

---

## Setup & Installation

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation Steps

1. **Clone repository**

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
   echo "VITE_API_BASE_URL=http://localhost:4000/api" > .env
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   Application available at `http://localhost:5173`

---

## Troubleshooting

### Token not included in API requests

- Verify token is in localStorage
- Check request interceptor in `src/helpers/api.js`
- Ensure login was successful

### Routes not accessible

- Verify user is logged in for protected routes
- Check admin status for admin routes
- Verify route paths in `src/App.jsx`

### State not updating

- Ensure reducer is in root reducer (`src/reducers/index.js`)
- Check action type names match exactly
- Verify dispatch is called correctly

### API errors

- Check backend server is running
- Verify API_BASE_URL in .env
- Check network tab in dev tools for request/response

### Redux DevTools not showing

- Ensure extension is installed
- Check store configuration includes middleware
- Refresh page after installation

---

## Key Files Quick Reference

| File                     | Purpose                               |
| ------------------------ | ------------------------------------- |
| `src/main.jsx`           | React entry point with Redux Provider |
| `src/App.jsx`            | Route definitions and layout          |
| `src/store/store.js`     | Redux store configuration             |
| `src/reducers/index.js`  | Root reducer combining all reducers   |
| `src/helpers/api.js`     | Axios instance with interceptors      |
| `src/hooks/useApi.js`    | Custom API hook                       |
| `src/actions/auth.js`    | Authentication thunks                 |
| `src/actions/train.js`   | Train search thunks                   |
| `src/actions/booking.js` | Booking thunks                        |
| `src/actions/admin.js`   | Admin thunks                          |

---

## License

This project is proprietary and confidential.

## Support

For more information about the technologies used:

- [React Documentation](https://react.dev)
- [Redux Documentation](https://redux.js.org)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Documentation](https://vitejs.dev)

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Status:** Complete Documentation
