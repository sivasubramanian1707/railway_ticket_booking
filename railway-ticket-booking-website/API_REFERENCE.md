# API Reference Guide

## Overview

This document provides detailed information about all API endpoints used in the Railway Ticket Booking Website application.

**Base URL:** `http://localhost:4000/api` (or configured via `VITE_API_BASE_URL`)

## Authentication

### Authorization Header

All authenticated requests must include an Authorization header with a Bearer token:

```
Authorization: Bearer {JWT_TOKEN}
```

The token is automatically added by the Axios request interceptor in [src/helpers/api.js](src/helpers/api.js).

### Token Storage

- Tokens are stored in `localStorage` after login
- Retrieved from localStorage in the request interceptor
- Removed from localStorage on 401 Unauthorized response
- Token persists across browser sessions

---

## Auth Endpoints

### 1. User Sign In (Login)

**Endpoint:** `POST /auth/sign-in`

**Authentication:** Not required

**Request Body:**

```javascript
{
  email: string,     // User email address
  password: string   // User password
}
```

**Success Response (200):**

```javascript
{
  token: string,           // JWT token for authentication
  userData: {
    _id: string,
    name: string,
    email: string,
    phoneNo: string,
    role: "USER" | "ADMIN",
    createdAt: string (ISO date),
    updatedAt: string (ISO date)
  }
}
```

**Error Response (401/400):**

```javascript
{
  errorMessage: string;
}
```

**Redux Action:** [src/actions/auth.js](src/actions/auth.js#L18) - `login(email, password)`

**Implementation Details:**

- Dispatches `LOGIN_REQUEST` action
- On success: stores token in localStorage and Redux state
- On failure: sets error message in Redux state
- Handled by [src/reducers/auth.js](src/reducers/auth.js)

---

### 2. User Sign Up (Registration)

**Endpoint:** `POST /auth/sign-up`

**Authentication:** Not required

**Request Body:**

```javascript
{
  name: string,       // User full name
  email: string,      // User email address
  phoneNo: string,    // User phone number
  password: string    // User password
}
```

**Success Response (201):**

```javascript
{
  user: {
    _id: string,
    name: string,
    email: string,
    phoneNo: string,
    role: "USER",
    createdAt: string (ISO date),
    updatedAt: string (ISO date)
  }
}
```

**Error Response (400/409):**

```javascript
{
  errorMessage: string; // e.g., "Email already exists"
}
```

**Redux Action:** [src/actions/auth.js](src/actions/auth.js#L43) - `signup(name, email, phoneNo, password)`

**Implementation Details:**

- Dispatches `SIGNUP_REQUEST` action
- Does not automatically log in user
- User must login after signup
- Handled by [src/reducers/auth.js](src/reducers/auth.js)

---

### 3. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Authentication:** Not required

**Request Body:**

```javascript
{
  email: string,       // User email
  password: string     // New password
}
```

**Success Response (200):**

```javascript
{
  message: string; // Password reset successful
}
```

**Error Response (404/400):**

```javascript
{
  errorMessage: string;
}
```

**Redux Action:** [src/actions/auth.js](src/actions/auth.js#L78) - `forgotPassword(email, password)`

**Implementation Details:**

- Dispatches `FORGOT_PASSWORD_REQUEST` action
- Does not automatically log in user
- User must login with new password after reset
- Handled by [src/reducers/auth.js](src/reducers/auth.js)

---

## Train Endpoints

### 4. Get All Stations

**Endpoint:** `GET /train/stations`

**Authentication:** Not required

**Query Parameters:** None

**Success Response (200):**

```javascript
[
  {
    _id: string,
    name: string,      // Station name (e.g., "New Delhi")
    code: string,      // Station code (e.g., "NDLS")
    createdAt: string (ISO date),
    updatedAt: string (ISO date)
  },
  // ... more stations
]
```

**Error Response (500):**

```javascript
{
  error: string;
}
```

**Redux Action:** [src/actions/train.js](src/actions/train.js#L22) - `fetchStations()`

**Implementation Details:**

- Dispatches `FETCH_STATIONS_REQUEST` action
- Populates Redux `train.stations` state
- Called on Search page load
- Handled by [src/reducers/train.js](src/reducers/train.js)

---

### 5. Search Trains

**Endpoint:** `GET /train/search`

**Authentication:** Not required

**Query Parameters:**

```
from: string   // Origin station ID or code
to: string     // Destination station ID or code
```

**Complete URL Example:**

```
GET /train/search?from=NDLS&to=MMR
```

**Success Response (200):**

```javascript
{
  trains: [
    {
      _id: string,
      trainNumber: string,    // e.g., "12001"
      trainName: string,      // e.g., "Rajdhani Express"
      totalSeats: number,
      fromStation: {
        _id: string,
        name: string,
        code: string
      },
      toStation: {
        _id: string,
        name: string,
        code: string
      },
      route: string (objectId),
      createdAt: string (ISO date),
      updatedAt: string (ISO date)
    },
    // ... more trains
  ]
}
```

**Error Response (400/500):**

```javascript
{
  message: string; // "Failed to search trains"
}
```

**Redux Action:** [src/actions/train.js](src/actions/train.js#L35) - `searchTrains(from, to)`

**Implementation Details:**

- Dispatches `SEARCH_TRAINS_REQUEST` action
- Populates `train.searchResults` state
- User sees list of trains to choose from
- Handled by [src/reducers/train.js](src/reducers/train.js)

---

## Booking Endpoints

### 6. Check Seat Availability

**Endpoint:** `POST /booking/check-availability`

**Authentication:** Not required

**Request Body:**

```javascript
{
  trainId: string,       // Train ID (objectId)
  travelDate: string     // Travel date (ISO date format, e.g., "2026-02-15")
}
```

**Success Response (200):**

```javascript
{
  trainId: string,
  travelDate: string,
  totalSeats: number,
  bookedSeats: number,     // Number of already booked seats
  availableSeats: number,  // totalSeats - bookedSeats
  bookedByDate: {
    // Detailed breakdown by date if multiple dates
  }
}
```

**Error Response (400/404):**

```javascript
{
  message: string; // "Train not found" or "No availability data"
}
```

**Redux Action:** [src/actions/train.js](src/actions/train.js#L48) - `checkAvailability(trainId, travelDate)`

**Implementation Details:**

- Dispatches `CHECK_AVAILABILITY_REQUEST` action
- Populates `train.availability` state
- Shows seat availability before booking
- Returns availability data for seat selection
- Handled by [src/reducers/train.js](src/reducers/train.js)

---

### 7. Create Booking

**Endpoint:** `POST /booking/create`

**Authentication:** Required (User must be logged in)

**Request Body:**

```javascript
{
  trainId: string,          // Train ID (objectId)
  fromStationId: string,    // Departure station ID
  toStationId: string,      // Arrival station ID
  travelDate: string,       // Travel date (ISO format)
  seatsBooked: number,      // Number of seats to book (1-6 typically)
  passengers: [
    {
      name: string,         // Passenger name
      age: number,          // Passenger age
      gender: "M" | "F",    // Gender
      seatNumber: number    // Assigned seat number
    },
    // ... more passengers
  ]
}
```

**Success Response (201):**

```javascript
{
  _id: string,              // Booking ID
  userId: string,           // User ID who made booking
  trainId: string,
  train: {
    _id: string,
    trainNumber: string,
    trainName: string,
    // ... train details
  },
  fromStation: string,
  toStation: string,
  travelDate: string,
  seatsBooked: number,
  seatNumbers: [number],    // Array of seat numbers
  passengers: [object],
  bookingStatus: "CONFIRMED" | "PENDING" | "CANCELLED",
  bookingDate: string (ISO date),
  totalPrice: number,       // Total booking cost
  createdAt: string (ISO date),
  updatedAt: string (ISO date)
}
```

**Error Response (400/401/409):**

```javascript
{
  error: string; // "Not enough seats available", "Seats already booked", etc.
}
```

**Redux Action:** [src/actions/booking.js](src/actions/booking.js#L18) - `bookTicket(...)`

**Implementation Details:**

- Dispatches `BOOK_TICKET_REQUEST` action
- Populates `booking.currentBooking` with booking confirmation
- Sets success message in Redux state
- On failure: Error message displayed to user
- Handled by [src/reducers/booking.js](src/reducers/booking.js)

---

### 8. Get User's Bookings

**Endpoint:** `GET /booking/my-bookings`

**Authentication:** Required (User must be logged in)

**Query Parameters:** None

**Success Response (200):**

```javascript
[
  {
    _id: string,
    userId: string,
    trainId: string,
    train: {
      _id: string,
      trainNumber: string,
      trainName: string
    },
    fromStation: {
      _id: string,
      name: string,
      code: string
    },
    toStation: {
      _id: string,
      name: string,
      code: string
    },
    travelDate: string,
    seatsBooked: number,
    seatNumbers: [number],
    passengers: [object],
    bookingStatus: "CONFIRMED" | "CANCELLED" | "PENDING",
    totalPrice: number,
    createdAt: string (ISO date),
    updatedAt: string (ISO date)
  },
  // ... more bookings
]
```

**Error Response (401/500):**

```javascript
{
  error: string;
}
```

**Redux Action:** [src/actions/booking.js](src/actions/booking.js#L56) - `fetchMyBookings()`

**Implementation Details:**

- Dispatches `FETCH_MY_BOOKINGS_REQUEST` action
- Populates `booking.bookings` array with user's bookings
- Shows in MyBookings page
- Handled by [src/reducers/booking.js](src/reducers/booking.js)

---

### 9. Cancel Booking

**Endpoint:** `POST /booking/cancel/:bookingId`

**Authentication:** Required (User must be logged in)

**URL Parameters:**

```
bookingId: string  // Booking ID to cancel
```

**Request Body:** Empty

**Success Response (200):**

```javascript
{
  _id: string,
  // ... booking object with updated status
  bookingStatus: "CANCELLED",
  cancelledAt: string (ISO date)
}
```

**Error Response (404/400/401):**

```javascript
{
  error: string; // "Booking not found", "Cannot cancel past booking", etc.
}
```

**Redux Action:** [src/actions/booking.js](src/actions/booking.js#L74) - `cancelBooking(bookingId)`

**Implementation Details:**

- Dispatches `CANCEL_BOOKING_REQUEST` action
- Updates booking in `booking.bookings` array with cancelled status
- Shows success message using Redux
- Handled by [src/reducers/booking.js](src/reducers/booking.js)

---

## Admin Endpoints

### 10. Get All Bookings (Paginated)

**Endpoint:** `GET /admin/bookings`

**Authentication:** Required (Admin only - role must be "ADMIN")

**Query Parameters:**

```
page: number   // Page number (default: 1)
limit: number  // Items per page (default: 10)
```

**Complete URL Example:**

```
GET /admin/bookings?page=1&limit=10
```

**Success Response (200):**

```javascript
{
  data: [
    {
      _id: string,
      userId: {
        _id: string,
        name: string,
        email: string
      },
      trainId: string,
      train: {
        trainNumber: string,
        trainName: string
      },
      travelDate: string,
      seatsBooked: number,
      passengers: [object],
      bookingStatus: string,
      totalPrice: number,
      createdAt: string,
      updatedAt: string
    },
    // ... more bookings
  ],
  pagination: {
    total: number,      // Total bookings count
    page: number,
    limit: number,
    pages: number       // Total pages
  }
}
```

**Error Response (401/403/500):**

```javascript
{
  error: string; // "Not authorized" or "Admin access required"
}
```

**Redux Action:** [src/actions/admin.js](src/actions/admin.js#L22) - `fetchAllBookings(page, limit)`

**Implementation Details:**

- Dispatches `FETCH_ALL_BOOKINGS_REQUEST` action
- Populates `admin.bookings` and `admin.pagination` state
- Requires admin token and role verification
- Handled by [src/reducers/admin.js](src/reducers/admin.js)

---

### 11. Add Station

**Endpoint:** `POST /admin/add-station`

**Authentication:** Required (Admin only)

**Request Body:**

```javascript
{
  name: string,   // Station name (e.g., "Mumbai Central")
  code: string    // Station code (e.g., "MMCT")
}
```

**Success Response (201):**

```javascript
{
  station: {
    _id: string,
    name: string,
    code: string,
    createdAt: string (ISO date),
    updatedAt: string (ISO date)
  }
}
```

**Error Response (400/409):**

```javascript
{
  errorMessage: string; // "Station code already exists"
}
```

**Redux Action:** [src/actions/admin.js](src/actions/admin.js#L48) - `addStation(name, code)`

**Implementation Details:**

- Dispatches `ADD_STATION_REQUEST` action
- Adds station to `admin.stations` array
- Shows success message
- Requires admin authorization
- Handled by [src/reducers/admin.js](src/reducers/admin.js)

---

### 12. Add Train

**Endpoint:** `POST /admin/add-train`

**Authentication:** Required (Admin only)

**Request Body:**

```javascript
{
  trainNumber: string,  // Unique train number (e.g., "12001")
  trainName: string,    // Train name (e.g., "Rajdhani Express")
  totalSeats: number    // Total seats in train
}
```

**Success Response (201):**

```javascript
{
  train: {
    _id: string,
    trainNumber: string,
    trainName: string,
    totalSeats: number,
    createdAt: string (ISO date),
    updatedAt: string (ISO date)
  }
}
```

**Error Response (400/409):**

```javascript
{
  errorMessage: string; // "Train number already exists"
}
```

**Redux Action:** [src/actions/admin.js](src/actions/admin.js#L68) - `addTrain(trainNumber, trainName, totalSeats)`

**Implementation Details:**

- Dispatches `ADD_TRAIN_REQUEST` action
- Adds train to `admin.trains` array
- Shows success message
- Requires admin authorization
- Handled by [src/reducers/admin.js](src/reducers/admin.js)

---

### 13. Add Route

**Endpoint:** `POST /admin/add-route`

**Authentication:** Required (Admin only)

**Request Body:**

```javascript
{
  trainId: string,      // Train ID (objectId)
  stops: [
    {
      stationId: string,     // Station ID
      stopOrder: number,     // Order of stop (1, 2, 3...)
      arrivalTime: string,   // Arrival time (HH:MM format)
      departureTime: string  // Departure time (HH:MM format)
    },
    // ... more stops
  ]
}
```

**Success Response (201):**

```javascript
{
  route: {
    _id: string,
    trainId: string,
    stops: [
      {
        stationId: string,
        stopOrder: number,
        arrivalTime: string,
        departureTime: string
      },
      // ... more stops
    ],
    createdAt: string (ISO date),
    updatedAt: string (ISO date)
  }
}
```

**Error Response (400/404):**

```javascript
{
  errorMessage: string; // "Train not found" or "Invalid station"
}
```

**Redux Action:** [src/actions/admin.js](src/actions/admin.js#L88) - `addRoute(trainId, stops)`

**Implementation Details:**

- Dispatches `ADD_ROUTE_REQUEST` action
- Adds route to `admin.routes` array
- Links train with stations and times
- Shows success message
- Requires admin authorization
- Handled by [src/reducers/admin.js](src/reducers/admin.js)

---

## Error Handling

### HTTP Status Codes

| Code | Meaning      | Handler                                                      |
| ---- | ------------ | ------------------------------------------------------------ |
| 200  | Success      | Dispatch SUCCESS action                                      |
| 201  | Created      | Dispatch SUCCESS action                                      |
| 400  | Bad Request  | Set error in state from `error.response?.data?.errorMessage` |
| 401  | Unauthorized | Remove token, redirect to /login                             |
| 403  | Forbidden    | Set error: "Access forbidden"                                |
| 404  | Not Found    | Set error from response                                      |
| 409  | Conflict     | Set error (usually duplicate resource)                       |
| 500  | Server Error | Set error from response                                      |

### Error Response Structure

Most error responses follow this format:

```javascript
{
  errorMessage: string,  // or "error" key
  message: string,       // Sometimes used instead
  details: string        // Additional details (optional)
}
```

### Redux Error Flow

1. API call fails
2. Action creator catches error
3. Dispatches `*_FAILURE` action with error message
4. Reducer sets `error` in state
5. Component reads `error` from Redux
6. Error message displayed to user

---

## Response Interceptor Behavior

### Request Interceptor

```javascript
// Automatically adds Authorization header if token exists
Authorization: Bearer {token}
```

### Response Interceptor

```javascript
// Handles 401 Unauthorized
if (error.response?.status === 401) {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirect to login
}

// Handles 403 Forbidden
if (error.response?.status === 403) {
  console.error("Access forbidden");
}
```

---

## Testing API Endpoints

### Using Postman or cURL

**Example: Login Request**

```bash
curl -X POST http://localhost:4000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Example: Authenticated Request**

```bash
curl -X GET http://localhost:4000/api/booking/my-bookings \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Common Integration Patterns

### Pattern 1: Redux Dispatch + Error Handling

```javascript
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/auth";

function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (email, password) => {
    try {
      dispatch(login(email, password));
    } catch (err) {
      // Error already in Redux state
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

### Pattern 2: useApi Hook

```javascript
import { useApi } from "../hooks/useApi";

function DataFetchComponent() {
  const { loading, error, get } = useApi();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await get("/train/stations");
      setData(response);
    } catch (err) {
      // Error already in useApi.error
    }
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && <div>{/* Display data */}</div>}
      <button onClick={fetchData}>Fetch</button>
    </>
  );
}
```

---

For more information, see [DOCUMENTATION.md](./DOCUMENTATION.md)
