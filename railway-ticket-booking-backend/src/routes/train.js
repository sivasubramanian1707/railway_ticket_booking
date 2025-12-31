const route = require("express").Router();
const { getAllStations, trainSearchResults } = require("../controllers/train");

route.get("/stations", getAllStations);
route.get("/search", trainSearchResults);

module.exports = route;
