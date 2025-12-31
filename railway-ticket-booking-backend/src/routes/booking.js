const { checkAvailablity, ticketBooking } = require("../controllers/booking");
const { authMiddleware } = require("../middlewares/middleware");

const routes = require("express").Router();

routes.post("/check-availability", authMiddleware, checkAvailablity);
routes.post("/create", authMiddleware, ticketBooking);

module.exports = routes;
