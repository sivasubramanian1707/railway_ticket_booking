const {
  checkAvailablity,
  ticketBooking,
  getUserBookings,
  cancelBooking,
} = require("../controllers/booking");
const { authMiddleware } = require("../middlewares/middleware");

const routes = require("express").Router();

routes.post("/create", authMiddleware, ticketBooking);
routes.get("/my-bookings", authMiddleware, getUserBookings);
routes.post("/cancel/:bookingId", authMiddleware, cancelBooking);
routes.post("/:id", authMiddleware, checkAvailablity);

module.exports = routes;
