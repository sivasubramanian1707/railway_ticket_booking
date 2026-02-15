const route = require("express").Router();
const {
  addStation,
  addTrain,
  addRoute,
  getAllBookings,
} = require("../controllers/admin");
const { authMiddleware, adminOnly } = require("../middlewares/middleware");

route.post("/station", authMiddleware, adminOnly, addStation);
route.post("/train", authMiddleware, adminOnly, addTrain);
route.post("/route", authMiddleware, adminOnly, addRoute);
route.get("/bookings", authMiddleware, adminOnly, getAllBookings);

module.exports = route;
