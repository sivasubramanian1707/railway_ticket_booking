# Railway Ticket Booking Backend

> Backend API for a simple railway ticket booking platform.

## Contents

- Overview
- Setup
- Environment variables
- API Endpoints (detailed)
- Error handling & notes

---

## Overview

This repository implements a REST API to manage users, trains, stations, routes and bookings. It uses Express + MongoDB (Mongoose). Authentication is JWT-based with role support (`USER`, `ADMIN`).

Base API prefix: `/api`

Health check: `GET /api/health`

---

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (see Environment variables below).

3. Run:

```bash
npm run dev   # for development (nodemon)
npm start     # production
```

Server default: `http://localhost:4000` (set `PORT` to change).

---

## Environment variables

Create a `.env` with at least the following keys:

- `MONGODB_CONNECTION_STRING` — MongoDB connection URI
- `PORT` — server port (optional)
- `JWT_AUTH_SECRET_KEY` — secret for auth JWTs
- `JWT_OTP_SECRET_KEY` — secret for OTP tokens
- `MAIL_ID` — email account used to send mails
- `MAIL_PASS_CODE` — password / app-password for mail account
- `CLIENT_URL` — allowed CORS origin (optional)
- `NODE_ENV` — `development` or `production` (optional)

---

## Authentication

- Protected endpoints require `Authorization: Bearer <token>` header.
- Obtain token from `POST /api/auth/sign-in`.
- Admin endpoints additionally require the authenticated user to have `role === "ADMIN"`.

---

## API Endpoints

All examples use `https://<host>/api` as the base.

1. Auth

- POST `/api/auth/sign-up`
  - Body (application/json):
    ```json
    {
      "name": "Alice",
      "email": "alice@example.com",
      "phoneNo": "9876543210",
      "password": "secret123"
    }
    ```
  - Success (201):
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "_id": "...",
        "name": "Alice",
        "email": "alice@example.com",
        "phoneNo": "9876543210",
        "role": "USER",
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    ```
  - Errors: 400 validation, 409 email exists

- POST `/api/auth/sign-in`
  - Body:
    ```json
    { "email": "alice@example.com", "password": "secret123" }
    ```
  - Success (200):
    ```json
    { "message":"Login successful","token":"<jwt>","userData":{...} }
    ```

- POST `/api/auth/forgot-password` (two-step OTP flow)
  - Step A (request OTP): send `{ "email":"user@example.com" }` → middleware sends an email OTP and returns `{ message, token }` where `token` is an OTPToken (JWT valid ~5min).
  - Step B (confirm reset): send `{ "email":"...","password":"newPass","OTPToken":"<token>","OTP":"123456" }` → on success, password updated (200).

2. Train

- GET `/api/train/stations`
  - Returns list of stations: each object has `_id`, `name`, `code`.

- GET `/api/train/search?from=<CODE>&to=<CODE>`
  - Query params: `from` station code, `to` station code (required, must differ)
  - Success (200):
    ```json
    {
      "count": 2,
      "trains": [
        {
          "routeId": "...",
          "trainId": "...",
          "trainName": "Express 1",
          "trainNumber": "12345",
          "totalSeats": 200,
          "from": "Station A",
          "to": "Station B",
          "fromCode": "STA",
          "toCode": "STB",
          "departureTime": "14:40",
          "arrivalTime": "18:00",
          "fare": 120
        }
      ]
    }
    ```

3. Booking (requires auth)

- POST `/api/booking/check-availability`
  - Body: `{ "trainId": "<id>", "travelDate": "YYYY-MM-DD" }`
  - Success (200):
    ```json
    {
      "totalSeats": 200,
      "bookedSeats": 50,
      "availableSeats": 150,
      "trainName": "...",
      "trainNumber": "..."
    }
    ```

- POST `/api/booking/create`
  - Body:
    ```json
    {
      "trainId": "...",
      "fromStationId": "...",
      "toStationId": "...",
      "travelDate": "2026-02-20",
      "seatsBooked": 2,
      "passengers": [
        { "name": "Bob", "age": 30, "gender": "MALE" },
        { "name": "Eve", "age": 28, "gender": "FEMALE" }
      ]
    }
    ```
  - Success (201):
    ```json
    {
      "message": "Booking confirmed successfully",
      "pnr": "PNR...",
      "totalFare": 240,
      "bookingId": "..."
    }
    ```
  - Notes: booking is created inside a MongoDB transaction; seat availability is re-checked atomically.

- GET `/api/booking/my-bookings`
  - Returns summary list of current user's bookings (with passenger count and booking meta).

- POST `/api/booking/cancel/:bookingId`
  - Cancels a booking (only by owner) if travel date is in future. Success (200): `{ message, pnr }`.

4. Admin (requires `Authorization` + admin role)

- POST `/api/admin/station`
  - Body: `{ "name":"Station A", "code":"STA" }` → 201 created station

- POST `/api/admin/train`
  - Body: `{ "trainNumber":"12345", "trainName":"Express 1", "totalSeats":200 }` → 201 created train

- POST `/api/admin/route`
  - Body: `{ "trainId":"...", "stops":[ { "stationId":"...", "order":1, "arrivalTime":"00:00","departureTime":"00:00","fareToNext":50 }, ... ] }`
  - Creates a route for the train (unique per train)

- GET `/api/admin/bookings?page=1&limit=10`
  - Returns paginated bookings and `pagination` object: `{ data: [...], pagination: { currentPage, limit, totalCount, totalPages } }`.

---

## Models (important fields)

- `User`: `_id, name, email, phoneNo, role` (`USER`|`ADMIN`)
- `Train`: `_id, trainNumber, trainName, totalSeats`
- `Station`: `_id, name, code`
- `TrainRoute`: `trainId, stops[]` — each stop: `stationId, arrivalTime, departureTime, order, fareToNext`
- `Booking`: `_id, userId, trainId, fromStationId, toStationId, travelDate, seatsBooked, totalFare, status, pnr`
- `Passenger`: `bookingId, name, age, gender`

---

## Error handling & status codes

- 200 — OK
- 201 — Created
- 400 — Validation or bad request
- 401 — Unauthorized (missing/invalid token or OTP issues)
- 403 — Forbidden (admin-only or wrong user)
- 404 — Not found
- 409 — Conflict (duplicate resource)
- 500 — Server error

Response error shape often uses `{ error: "message" }` or `{ errorMessage: "message" }`.

---

## Example curl requests

Sign in:

```bash
curl -X POST http://localhost:4000/api/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

Search trains:

```bash
curl "http://localhost:4000/api/train/search?from=STA&to=STB"
```

Create booking (authenticated):

```bash
curl -X POST http://localhost:4000/api/booking/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"trainId":"...","fromStationId":"...","toStationId":"...","travelDate":"2026-02-20","seatsBooked":1,"passengers":[{"name":"A","age":30,"gender":"MALE"}]}'
```

---

## Notes & suggestions

- OTP flow for `forgot-password` is implemented by the middleware: first call without `OTPToken` to receive a token and email; then call again with `OTPToken` and `OTP` plus `password` to update password.
- `trainRoute.stops[].fareToNext` is the fare from that stop to the **next** stop; the code calculates cumulative fares when searching/booking.
- Rate limiting and request validation helpers exist in `src/middlewares/validation.js` and can be applied to routes.

If you want, I can:

- Add generated OpenAPI (Swagger) spec from these controllers.
- Add example Postman collection.

---

File: [README.md](README.md)
