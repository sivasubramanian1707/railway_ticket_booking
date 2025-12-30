const route = require("express").Router();
const { addStation, addTrain, addRoute } = require("../controllers/admin");
const { authMiddleware, adminOnly } = require("../middlewares/middleware");

route.post("/station", authMiddleware, adminOnly, addStation);
route.post("/train", authMiddleware, adminOnly, addTrain);
route.post("/route", authMiddleware, adminOnly, addRoute);

module.exports = route;
