# Project Structure & Navigation Guide

## Overview

This guide helps you navigate and understand the Railway Ticket Booking Website codebase structure. Each section explains the purpose of different folders and files.

---

## Directory Tree

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
│   └── (favicon, robots.txt, etc)
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
│   │   └── (Feature components)
│   │
│   ├── 📁 constants/
│   │   └── reducerConstants.js  # Redux action type constants
│   │
│   ├── 📁 helpers/
│   │   └── api.js               # Axios instance with interceptors
│   │
│   ├── 📁 hooks/
│   │   └── useApi.js            # Custom API hook
│   │
│   ├── 📁 reducers/             # Redux reducers
│   │   ├── auth.js              # Auth state reducer
│   │   ├── booking.js           # Booking state reducer
│   │   ├── train.js             # Train state reducer
│   │   ├── admin.js             # Admin state reducer
│   │   └── index.js             # Root reducer (combineReducers)
│   │
│   ├── 📁 store/
│   │   └── store.js             # Redux store configuration
│   │
│   ├── 📁 styles/
│   │   ├── admin.css
│   │   ├── app.css
│   │   ├── auth.css
│   │   ├── booking.css
│   │   ├── globals.css
│   │   ├── home.css
│   │   ├── index.css
│   │   ├── my-bookings.css
│   │   ├── navbar.css
│   │   ├── search.css
│   │   └── theme-modern.css
│   │
│   └── 📁 assets/               # Images, icons, fonts
│
└── 📁 Documentation Files (in root)
    ├── README.md                # Project overview
    ├── DOCUMENTATION.md         # Comprehensive documentation
    ├── API_REFERENCE.md         # API endpoints reference
    ├── REDUX_GUIDE.md           # Redux architecture guide
    └── PROJECT_STRUCTURE.md     # This file
```

---

## Core Directories Explained

### 1. `src/actions/` - Redux Action Creators

**Purpose:** Contains all Redux action creators and thunks for async operations.

**Files:**

#### `auth.js`

- **Responsible for:** User authentication state management
- **Action Types:**
  - `LOGIN_REQUEST/SUCCESS/FAILURE`
  - `SIGNUP_REQUEST/SUCCESS/FAILURE`
  - `FORGOT_PASSWORD_REQUEST/SUCCESS/FAILURE`
  - `LOGOUT`
  - `CLEAR_ERROR`
- **Key Actions:**
  - `login(email, password)` - Async: POST /auth/sign-in
  - `signup(name, email, phoneNo, password)` - Async: POST /auth/sign-up
  - `forgotPassword(email, password)` - Async: POST /auth/forgot-password
  - `logout()` - Sync: Clear token and user data
  - `clearError()` - Sync: Clear error messages

#### `train.js`

- **Responsible for:** Train search and availability
- **Action Types:**
  - `FETCH_STATIONS_REQUEST/SUCCESS/FAILURE`
  - `SEARCH_TRAINS_REQUEST/SUCCESS/FAILURE`
  - `CHECK_AVAILABILITY_REQUEST/SUCCESS/FAILURE`
  - `CLEAR_SEARCH_RESULTS`
- **Key Actions:**
  - `fetchStations()` - Async: GET /train/stations
  - `searchTrains(from, to)` - Async: GET /train/search
  - `checkAvailability(trainId, date)` - Async: POST /booking/check-availability
  - `clearSearchResults()` - Sync: Reset search state

#### `booking.js`

- **Responsible for:** User bookings
- **Action Types:**
  - `BOOK_TICKET_REQUEST/SUCCESS/FAILURE`
  - `FETCH_MY_BOOKINGS_REQUEST/SUCCESS/FAILURE`
  - `CANCEL_BOOKING_REQUEST/SUCCESS/FAILURE`
  - `CLEAR_BOOKING_MESSAGE`
- **Key Actions:**
  - `bookTicket(...)` - Async: POST /booking/create
  - `fetchMyBookings()` - Async: GET /booking/my-bookings
  - `cancelBooking(bookingId)` - Async: POST /booking/cancel/:id
  - `clearBookingMessage()` - Sync: Clear messages

#### `admin.js`

- **Responsible for:** Admin operations
- **Action Types:**
  - `FETCH_ALL_BOOKINGS_REQUEST/SUCCESS/FAILURE`
  - `ADD_STATION_REQUEST/SUCCESS/FAILURE`
  - `ADD_TRAIN_REQUEST/SUCCESS/FAILURE`
  - `ADD_ROUTE_REQUEST/SUCCESS/FAILURE`
  - `CLEAR_ADMIN_MESSAGE`
- **Key Actions:**
  - `fetchAllBookings(page, limit)` - Async: GET /admin/bookings
  - `addStation(name, code)` - Async: POST /admin/add-station
  - `addTrain(trainnumber, name, seats)` - Async: POST /admin/add-train
  - `addRoute(trainId, stops)` - Async: POST /admin/add-route
  - `clearAdminMessage()` - Sync: Clear messages

---

### 2. `src/reducers/` - Redux State Reducers

**Purpose:** Contains pure functions that manage state changes based on actions.

**Files:**

#### `index.js` - Root Reducer

```javascript
// Combines all individual reducers
combineReducers({
  auth: authReducer,
  train: trainReducer,
  booking: bookingReducer,
  admin: adminReducer,
});
```

#### `auth.js` - Authentication State

- **State Path:** `state.auth`
- **Manages:** User token, userData, loading, errors, messages
- **Related Actions:** All LOGIN, SIGNUP, LOGOUT actions
- **Key Feature:** Persists token to localStorage

#### `train.js` - Train Management State

- **State Path:** `state.train`
- **Manages:** Stations list, search results, availability data
- **Related Actions:** FETCH_STATIONS, SEARCH_TRAINS, CHECK_AVAILABILITY
- **Usage:** Search page, Train details page

#### `booking.js` - Booking State

- **State Path:** `state.booking`
- **Manages:** User's bookings, current booking, loading, errors
- **Related Actions:** BOOK_TICKET, FETCH_MY_BOOKINGS, CANCEL_BOOKING
- **Usage:** MyBookings page, Booking confirmation

#### `admin.js` - Admin State

- **State Path:** `state.admin`
- **Manages:** All bookings (paginated), stations, trains, routes
- **Related Actions:** All FETCH_ALL_BOOKINGS, ADD_STATION, ADD_TRAIN, ADD_ROUTE
- **Usage:** Admin dashboard

---

### 3. `src/app/pages/` - Page Components

**Purpose:** Full-page components for different routes.

#### `Home.jsx` - Landing Page

- **Route:** `/`
- **Access:** Public (no auth required)
- **Features:**
  - Welcome message
  - Links to login/register
  - Overview of app features
  - Call-to-action buttons

#### `Login.jsx` - User Login

- **Route:** `/login`
- **Access:** Public (redirects to home if already logged in)
- **Features:**
  - Email input
  - Password input
  - Login button
  - Links to Register and Forgot Password
  - Error display
  - Dispatches: `login(email, password)`
- **Uses Redux:** `auth.loading`, `auth.error`, `auth.successMessage`

#### `Register.jsx` - User Registration

- **Route:** `/register`
- **Access:** Public
- **Features:**
  - Name input
  - Email input
  - Phone number input
  - Password input
  - Register button
  - Links to Login
  - Email validation
  - Dispatches: `signup(...)`
- **Uses Redux:** `auth.loading`, `auth.error`

#### `ForgotPassword.jsx` - Password Reset

- **Route:** `/forgot-password`
- **Access:** Public
- **Features:**
  - Email input
  - New password input
  - Reset button
  - Link to login
  - Dispatches: `forgotPassword(email, password)`
- **Uses Redux:** `auth.loading`, `auth.error`

#### `Search.jsx` - Train Search (Protected)

- **Route:** `/search`
- **Access:** User (authenticated users only)
- **Features:**
  - From station dropdown
  - To station dropdown
  - Travel date input
  - Search button
  - Displays search results list
  - Dispatches:
    - `fetchStations()` on mount
    - `searchTrains(from, to)` on search
  - Uses Redux:
    - `train.stations` for dropdowns
    - `train.searchResults` to display trains
    - `train.loading`, `train.error`

#### `TrainDetails.jsx` - Train Details & Booking (Protected)

- **Route:** `/train/:id`
- **Route Parameter:** `id` - Train ID
- **Access:** User (authenticated users only)
- **Features:**
  - Train information display
  - Seat availability status
  - Passenger details form (1-6 passengers)
  - Seat selection
  - Book button
  - Dispatches:
    - `checkAvailability(trainId, date)` on load
    - `bookTicket(...)` on book button
  - Uses Redux:
    - `train.availability` to show seats
    - `booking.currentBooking` for confirmation

#### `MyBookings.jsx` - User Bookings Management (Protected)

- **Route:** `/my-bookings`
- **Access:** User (authenticated users only)
- **Features:**
  - List of user's bookings
  - Shows booking details (train, date, seats, status)
  - Cancel booking button
  - Booking status display
  - Dispatches:
    - `fetchMyBookings()` on mount
    - `cancelBooking(bookingId)` on cancel
  - Uses Redux:
    - `booking.bookings` to list bookings
    - `booking.loading`, `booking.error`

#### `AdminDashboard.jsx` - Admin Panel (Protected Admin Only)

- **Route:** `/admin`, `/admin/add-train`, `/admin/add-route`, `/admin/bookings`
- **Access:** Admin (token required + role === "ADMIN")
- **Features:**
  - Dashboard tabs/sections
  - Add Train form
  - Add Station form
  - Add Route form
  - View All Bookings (paginated)
  - Dispatches:
    - All admin actions from `src/actions/admin.js`
  - Uses Redux:
    - `admin.bookings`, `admin.stations`, `admin.trains`, `admin.routes`

---

### 4. `src/app/privateRoutes/` - Protected Routes

**Purpose:** Wrapper components that protect routes based on authentication and roles.

#### `UserRoute.jsx`

```javascript
// Protects routes that require user authentication
// Checks: state.auth.token exists
// Allows: Any authenticated user
// Redirects: To /login if no token
```

**Protected Routes:**

- `/search`
- `/train/:id`
- `/my-bookings`

#### `AdminRoute.jsx`

```javascript
// Protects routes that require admin access
// Checks: state.auth.token exists AND state.auth.user?.role === "ADMIN"
// Allows: Only admin users
// Redirects: To /login if not authenticated or not admin
```

**Protected Routes:**

- `/admin`
- `/admin/add-train`
- `/admin/add-route`
- `/admin/bookings`

---

### 5. `src/helpers/` - Helper Functions and Configuration

#### `api.js` - Axios Configuration

**Purpose:** Centralized API client with interceptors

**Key Features:**

1. **Base URL Configuration**
   - From environment: `VITE_API_BASE_URL`
   - Default: `http://localhost:4000/api`

2. **Request Interceptor**

   ```javascript
   - Adds Authorization header with JWT token
   - Format: Authorization: Bearer {token}
   - Only if token exists in localStorage
   ```

3. **Response Interceptor**
   ```javascript
   - Handles 401: Removes token, redirects to /login
   - Handles 403: Logs access forbidden
   - Other errors: Passes to caller
   ```

**Usage:**

```javascript
import api from "../helpers/api";
api.get("/endpoint");
api.post("/endpoint", data);
api.put("/endpoint", data);
api.delete("/endpoint");
```

---

### 6. `src/hooks/` - Custom React Hooks

#### `useApi.js` - Custom API Hook

**Purpose:** Simplifies API requests with built-in error and loading handling

**Provides:**

```javascript
const { loading, error, get, post, put, patch, delete: del } = useApi();
```

**Features:**

- Automatic loading state management
- Automatic error handling
- Methods for all HTTP verbs
- Throws errors for component handling

**Usage:**

```javascript
const { loading, error, get } = useApi();
const data = await get("/endpoint");
```

---

### 7. `src/store/` - Redux Store

#### `store.js` - Store Configuration

**Purpose:** Creates and configures the Redux store

**Key Configuration:**

```javascript
- Creates store from rootReducer
- Applies redux-thunk middleware for async actions
- Returns single store instance
```

**Global Access:**

```javascript
// In main.jsx, store is wrapped with Provider
// Access in components via useSelector and useDispatch hooks
```

---

### 8. `src/styles/` - CSS Stylesheets

| File                | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `globals.css`       | Global styles, reset, base styles         |
| `index.css`         | Main stylesheet index                     |
| `app.css`           | App component styles                      |
| `navbar.css`        | Navigation bar styles                     |
| `auth.css`          | Login/Register/ForgotPassword page styles |
| `home.css`          | Home page styles                          |
| `search.css`        | Search page styles                        |
| `booking.css`       | Booking/booking details styles            |
| `my-bookings.css`   | MyBookings page styles                    |
| `admin.css`         | Admin dashboard styles                    |
| `theme-modern.css`  | Theme customization styles                |
| `clean-globals.css` | Additional global resets                  |

---

### 9. `src/components/` - Reusable Components

**Purpose:** Shared UI components used across pages.

**Note:** Directory exists but appears to be empty. Components to add might include:

- Loading spinners
- Error messages
- Buttons
- Forms
- Cards
- Modal dialogs
- Table components

---

### 10. `src/constants/` - Constants

#### `reducerConstants.js`

**Purpose:** Centralized Redux action type constants (if used)

**Benefits:**

- Avoid typos in action types
- Single source of truth
- Easy refactoring

---

## File Navigation Workflow

### Scenario 1: Adding a New Feature

1. **Start with the page component**
   - Create in `src/app/pages/`

2. **Create Redux actions**
   - Add to `src/actions/featureName.js`
   - Define action types

3. **Create reducer**
   - Add to `src/reducers/featureName.js`
   - Handle all action types

4. **Combine reducer**
   - Add to `src/reducers/index.js`

5. **Use in component**
   - Redux hooks to access state and dispatch

### Scenario 2: Fixing a Bug

1. **Identify the issue location**
   - Could be: Component, Action, Reducer, or API

2. **Check Redux state**
   - Use Redux DevTools or console
   - Verify reducer logic

3. **Check API**
   - Look at `src/helpers/api.js`
   - Check request/response in action

4. **Check component**
   - Verify selectors are correct
   - Check error handling

### Scenario 3: Understanding User Flow

1. **Start with route**
   - See `src/App.jsx` for route -> page mapping

2. **Go to page component**
   - Check what data it needs
   - See what actions it dispatches

3. **Look at actions**
   - See what API endpoints are called
   - Understand request/response format

4. **Check reducers**
   - See how response updates state

5. **Back to component**
   - See how component displays state

---

## Import Path Examples

### Correct Imports

```javascript
// Actions
import { login } from "../actions/auth";
import { searchTrains } from "../actions/train";

// Reducers (rarely imported directly)
import reducer from "../reducers/auth";

// Components
import Navbar from "../app/layout/Navbar";
import Login from "../app/pages/Login";

// Hooks
import { useApi } from "../hooks/useApi";

// Helpers
import api from "../helpers/api";

// Redux
import { useSelector, useDispatch } from "react-redux";

// Styles
import "../styles/app.css";
```

---

## File Size Reference

**Expected Sizes:**

| File                        | Typical Size  |
| --------------------------- | ------------- |
| Simple reducer              | 100-300 lines |
| Action file with 3-4 thunks | 200-400 lines |
| Page component              | 200-500 lines |
| Utility component           | 50-150 lines  |
| Custom hook                 | 50-100 lines  |
| API helper                  | 30-50 lines   |

---

## Quick Access Guide

### To find...

**Authentication logic** → `src/actions/auth.js` → `src/reducers/auth.js`

**Train search logic** → `src/actions/train.js` → `src/reducers/train.js`

**Booking logic** → `src/actions/booking.js` → `src/reducers/booking.js`

**Admin operations** → `src/actions/admin.js` → `src/reducers/admin.js`

**Login page** → `src/app/pages/Login.jsx`

**Search page** → `src/app/pages/Search.jsx`

**Routes** → `src/App.jsx`

**Store setup** → `src/store/store.js`

**API configuration** → `src/helpers/api.js`

**Protected routes** → `src/app/privateRoutes/`

---

## Development Tips

1. **Always check Redux DevTools** when debugging state issues
2. **Follow the action → reducer → component flow** to understand data flow
3. **Use meaningful component names** that reflect their purpose
4. **Keep actions and reducers together** conceptually (same domain)
5. **Check API response** in browser DevTools Network tab
6. **Use TypeScript or JSDoc** for better autocomplete and documentation
7. **Component separation:** Pages are full screens, Components are reusable

---

For comprehensive documentation, see:

- [README.md](./README.md) - Project overview
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete guide
- [API_REFERENCE.md](./API_REFERENCE.md) - API endpoints
- [REDUX_GUIDE.md](./REDUX_GUIDE.md) - Redux deep dive
