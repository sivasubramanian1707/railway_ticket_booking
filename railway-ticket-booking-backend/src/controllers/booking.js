const { default: mongoose } = require("mongoose");
const booking = require("../models/booking");
const train = require("../models/train");
const trainRoute = require("../models/trainRoute");
const { calculateFareForBooking } = require("../helper/commonFunctions");
const passanger = require("../models/passanger");

exports.checkAvailablity = async (req, res) => {
  try {
    const { trainId, travelDate } = req.body;

    const trainDeatils = await train.findById(trainId);
    if (!trainDeatils)
      return res.status(404).json({ message: "Train not found" });

    const bookings = await booking.find({
      trainId,
      travelDate,
      status: "CONFIRMED",
    });

    const bookedSeats = bookings.reduce((sum, b) => sum + b.seatsBooked, 0);

    const availableSeats = trainDeatils.totalSeats - bookedSeats;

    res.status(200).json({
      totalSeats: trainDeatils.totalSeats,
      bookedSeats,
      availableSeats,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.ticketBooking = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      trainId,
      fromStationId,
      toStationId,
      travelDate,
      seatsBooked,
      passengers,
    } = req.body;

    const userId = req.user.userId;
    console.log(req.user);

    const trainDetails = await train.findById(trainId).session(session);
    if (!trainDetails) throw new Error("Train not found");

    const route = await trainRoute.findOne({ trainId }).session(session);
    if (!route) throw new Error("Route not found");

    // 🔹 Fare per seat
    const farePerSeat = calculateFareForBooking(
      route,
      fromStationId,
      toStationId
    );

    // 🔹 Seat availability
    const bookings = await booking
      .find({
        trainId,
        travelDate,
        status: "CONFIRMED",
      })
      .session(session);

    const bookedSeats = bookings.reduce((sum, b) => sum + b.seatsBooked, 0);

    if (bookedSeats + seatsBooked > trainDetails.totalSeats)
      throw new Error("Not enough seats available");

    // 🔹 Create booking
    const bookingDetails = await booking.create(
      [
        {
          userId,
          trainId,
          fromStationId,
          toStationId,
          travelDate,
          seatsBooked,
          totalFare: farePerSeat * seatsBooked,
        },
      ],
      { session }
    );

    // 🔹 Create passengers
    const passengerDocs = passengers.map((p) => ({
      bookingId: bookingDetails[0]._id,
      ...p,
    }));

    await passanger.insertMany(passengerDocs, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Booking confirmed",
      pnr: bookingDetails[0].pnr,
      totalFare: bookingDetails[0].totalFare,
    });
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};
