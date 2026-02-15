const route = require("express").Router();
const { getAllStations, trainSearchResults } = require("../controllers/train");
const train = require("../models/train");

route.get("/stations", getAllStations);
route.get("/search", trainSearchResults);
route.get("/", async (req, res) => {
  try {
    const trains = await train.find().lean();
    res.status(200).json(trains);
  } catch (err) {
    console.error("Error fetching trains:", err);
    res.status(500).json({ error: "Failed to fetch trains" });
  }
});

module.exports = route;
