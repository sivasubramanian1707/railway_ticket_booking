const booking = require("../models/booking");
const station = require("../models/station");
const train = require("../models/train");
const trainRoute = require("../models/trainRoute");
const {
  validateRequired,
  validatePositiveNumber,
} = require("../helper/validation");

exports.addStation = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Input validation
    if (!validateRequired(name) || !validateRequired(code)) {
      return res
        .status(400)
        .json({ errorMessage: "Name and code are required" });
    }

    const existCode = await station.findOne({ code: code.toUpperCase() });
    if (existCode) {
      return res
        .status(409)
        .json({ errorMessage: "Station code already exists" });
    }

    const stationData = await station.create({
      name: name.trim(),
      code: code.toUpperCase(),
    });

    res.status(201).json({
      message: "Station added successfully",
      station: stationData,
    });
  } catch (error) {
    console.error("Add station error:", error);
    res.status(500).json({ errorMessage: "Failed to add station" });
  }
};

exports.addTrain = async (req, res) => {
  try {
    const { trainNumber, trainName, totalSeats } = req.body;

    // Input validation
    if (
      !validateRequired(trainNumber) ||
      !validateRequired(trainName) ||
      !validatePositiveNumber(totalSeats)
    ) {
      return res.status(400).json({
        errorMessage: "All fields are required (totalSeats must be positive)",
      });
    }

    const existTrain = await train.findOne({ trainNumber: trainNumber.trim() });
    if (existTrain) {
      return res
        .status(409)
        .json({ errorMessage: "Train number already exists" });
    }

    const trainData = await train.create({
      trainNumber: trainNumber.trim(),
      trainName: trainName.trim(),
      totalSeats: Number(totalSeats),
    });

    res.status(201).json({
      message: "Train added successfully",
      train: trainData,
    });
  } catch (error) {
    console.error("Add train error:", error);
    res.status(500).json({ errorMessage: "Failed to add train" });
  }
};

exports.addRoute = async (req, res) => {
  try {
    const { trainId, stops } = req.body;

    // Input validation
    if (!trainId) {
      return res.status(400).json({ errorMessage: "Train ID is required" });
    }

    if (!Array.isArray(stops) || stops.length < 2) {
      return res
        .status(400)
        .json({ errorMessage: "At least 2 stops are required" });
    }

    // Verify train exists
    const trainExists = await train.findById(trainId);
    if (!trainExists) {
      return res.status(404).json({ errorMessage: "Train not found" });
    }

    // Check if route already exists
    const existing = await trainRoute.findOne({ trainId });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Route already exists for this train" });
    }

    const route = await trainRoute.create({ trainId, stops });

    res.status(201).json({
      message: "Route added successfully",
      route: route,
    });
  } catch (err) {
    console.error("Add route error:", err);
    res
      .status(500)
      .json({ errorMessage: err.message || "Failed to add route" });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const bookingsQuery = booking
      .find()
      .populate("userId", "name email phoneNo")
      .populate("trainId", "trainName trainNumber")
      .populate("fromStationId", "name code")
      .populate("toStationId", "name code")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const [bookings, totalCount] = await Promise.all([
      bookingsQuery.exec(),
      booking.countDocuments(),
    ]);

    res.json({
      data: bookings,
      pagination: {
        currentPage: page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
