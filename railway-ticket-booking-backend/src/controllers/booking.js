const { default: mongoose } = require("mongoose");
const booking = require("../models/booking");
const train = require("../models/train");
const trainRoute = require("../models/trainRoute");
const station = require("../models/station");
const { calculateFareForBooking } = require("../helper/commonFunctions");
const passanger = require("../models/passanger");
const { validatePositiveNumber } = require("../helper/validation");

exports.checkAvailablity = async (req, res) => {
  try {
    const { trainId, travelDate } = req.body;

    // Input validation
    if (!trainId || !travelDate) {
      return res
        .status(400)
        .json({ message: "Train ID and travel date are required" });
    }

    const trainDeatils = await train.findById(trainId);
    if (!trainDeatils) {
      return res.status(404).json({ message: "Train not found" });
    }

    // Use aggregation for better performance
    const bookingStats = await booking.aggregate([
      {
        $match: {
          trainId: mongoose.Types.ObjectId.createFromHexString(trainId),
          travelDate: new Date(travelDate),
          status: "CONFIRMED",
        },
      },
      {
        $group: {
          _id: null,
          bookedSeats: { $sum: "$seatsBooked" },
        },
      },
    ]);

    const bookedSeats = bookingStats[0]?.bookedSeats || 0;
    const availableSeats = trainDeatils.totalSeats - bookedSeats;

    res.status(200).json({
      totalSeats: trainDeatils.totalSeats,
      bookedSeats,
      availableSeats,
      trainName: trainDeatils.trainName,
      trainNumber: trainDeatils.trainNumber,
    });
  } catch (err) {
    console.error("Availability check error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.ticketBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  console.log("Booking request data:", req.body.trainId);
  try {
    const {
      trainId,
      fromStationId,
      toStationId,
      travelDate,
      seatsBooked,
      passengers,
    } = req.body.trainId;

    // Input validation
    if (
      !trainId ||
      !fromStationId ||
      !toStationId ||
      !travelDate ||
      !seatsBooked
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!Array.isArray(passengers) || passengers.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one passenger is required" });
    }

    const userId = req.user?.userData?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Invalid user token" });
    }

    if (!validatePositiveNumber(seatsBooked)) {
      return res
        .status(400)
        .json({ error: "seatsBooked must be a positive number" });
    }

    const [fromStation, toStation] = await Promise.all([
      mongoose.Types.ObjectId.isValid(fromStationId)
        ? station.findById(fromStationId).session(session)
        : station
            .findOne({ code: String(fromStationId).toUpperCase() })
            .session(session),
      mongoose.Types.ObjectId.isValid(toStationId)
        ? station.findById(toStationId).session(session)
        : station
            .findOne({ code: String(toStationId).toUpperCase() })
            .session(session),
    ]);

    if (!fromStation || !toStation) {
      throw new Error("Invalid fromStationId or toStationId");
    }

    const fromStationObjectId = fromStation._id;
    const toStationObjectId = toStation._id;

    const trainDetails = await train.findById(trainId).session(session);
    if (!trainDetails) throw new Error("Train not found");

    const route = await trainRoute.findOne({ trainId }).session(session);
    if (!route) throw new Error("Route not found");

    const stationIdsOnRoute = route.stops.map((stop) =>
      stop.stationId.toString(),
    );
    if (
      !stationIdsOnRoute.includes(fromStationObjectId.toString()) ||
      !stationIdsOnRoute.includes(toStationObjectId.toString())
    ) {
      throw new Error("Selected stations are not on this train route");
    }

    // Calculate fare
    const farePerSeat = calculateFareForBooking(
      route,
      fromStationObjectId,
      toStationObjectId,
    );

    // Check seat availability
    const bookingStats = await booking
      .aggregate([
        {
          $match: {
            trainId: mongoose.Types.ObjectId.createFromHexString(trainId),
            travelDate: new Date(travelDate),
            status: "CONFIRMED",
          },
        },
        {
          $group: {
            _id: null,
            bookedSeats: { $sum: "$seatsBooked" },
          },
        },
      ])
      .session(session);

    const bookedSeats = bookingStats[0]?.bookedSeats || 0;

    if (bookedSeats + seatsBooked > trainDetails.totalSeats) {
      throw new Error("Not enough seats available");
    }

    // Create booking
    const bookingDetails = await booking.create(
      [
        {
          userId,
          trainId,
          fromStationId: fromStationObjectId,
          toStationId: toStationObjectId,
          travelDate: new Date(travelDate),
          seatsBooked,
          totalFare: farePerSeat * seatsBooked,
        },
      ],
      { session },
    );

    // Create passengers
    const passengerDocs = passengers.map((p) => ({
      bookingId: bookingDetails[0]._id,
      ...p,
    }));

    await passanger.insertMany(passengerDocs, { session });

    await session.commitTransaction();

    res.status(201).json({
      message: "Booking confirmed successfully",
      pnr: bookingDetails[0].pnr,
      totalFare: bookingDetails[0].totalFare,
      bookingId: bookingDetails[0]._id,
    });
  } catch (err) {
    console.error("Booking error:", err);
    await session.abortTransaction();
    res.status(400).json({ error: err.message || "Booking failed" });
  } finally {
    session.endSession();
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.userData?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Invalid user token" });
    }

    const bookings = await booking
      .find({ userId })
      .populate("trainId", "trainName trainNumber")
      .populate("fromStationId", "name code")
      .populate("toStationId", "name code")
      .sort({ createdAt: -1 });

    const bookingDetails = await Promise.all(
      bookings.map(async (b) => {
        const passengers = await passanger.find({ bookingId: b._id });
        return {
          _id: b._id,
          pnr: b.pnr,
          trainName: b.trainId.trainName,
          trainNumber: b.trainId.trainNumber,
          fromStation: b.fromStationId?.name,
          toStation: b.toStationId?.name,
          travelDate: b.travelDate,
          seatsBooked: b.seatsBooked,
          totalFare: b.totalFare,
          status: b.status,
          passengers: passengers.length,
          createdAt: b.createdAt,
        };
      }),
    );

    res.status(200).json({
      bookings: bookingDetails,
      total: bookingDetails.length,
    });
  } catch (err) {
    console.error("Get user bookings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?.userData?._id || req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Invalid user token" });
    }

    if (!bookingId) {
      return res.status(400).json({ error: "Booking ID is required" });
    }

    const bookingDetails = await booking.findById(bookingId);

    if (!bookingDetails) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (bookingDetails.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to cancel this booking" });
    }

    if (bookingDetails.status === "CANCELLED") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    // Check if travel date is in future
    const travelDate = new Date(bookingDetails.travelDate);
    if (travelDate < new Date()) {
      return res.status(400).json({ error: "Cannot cancel past bookings" });
    }

    bookingDetails.status = "CANCELLED";
    await bookingDetails.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      pnr: bookingDetails.pnr,
    });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
