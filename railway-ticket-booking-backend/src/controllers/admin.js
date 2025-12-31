const booking = require("../models/booking");
const station = require("../models/station");
const train = require("../models/train");
const trainRoute = require("../models/trainRoute");

exports.addStation = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code)
      return res.status(400).json({ errorMessage: "Fill all the Fields" });
    const existCode = await station.findOne({ code });
    if (existCode)
      return res.status(400).json({ errorMessage: "Code Aldready Exist!" });
    const stationData = await station.create({ name, code });
    res.status(201).json(stationData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ errorMessage: "Something went wrong!" });
  }
};

exports.addTrain = async (req, res) => {
  try {
    const { trainNumber, trainName, totalSeats } = req.body;
    if (!trainNumber || !trainName || !totalSeats)
      return res.status(400).json({ errorMessage: "Fill all the Fields" });
    const existTrain = await train.findOne({ trainNumber });
    if (existTrain)
      return res
        .status(400)
        .json({ errorMessage: "Train Number Aldready Exist!" });
    const trainData = await train.create({
      trainNumber,
      trainName,
      totalSeats,
    });
    res.status(201).json(trainData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ errorMessage: "Something went wrong!" });
  }
};

exports.addRoute = async (req, res) => {
  try {
    const { trainId, stops } = req.body;
    if (!trainId)
      return res.status(400).json({ errorMessage: "Select the Train!" });
    if (stops.length < 2)
      return res.status(400).json({ errorMessage: "Add one more stop" });
    const existing = await trainRoute.findOne({
      trainId: req.body.trainId,
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "Route already exists for this train" });

    const route = await trainRoute.create(req.body);
    res.status(201).json(route);
  } catch (err) {
    console.log(err);
    res.status(400).json({ errorMessage: err.message });
  }
};

const getAllBookings = async (req, res) => {
  const bookings = await booking
    .find()
    .populate("userId", "name email")
    .populate("trainId", "trainName trainNumber")
    .populate("fromStationId", "name code")
    .populate("toStationId", "name code");

  res.json(bookings);
};
