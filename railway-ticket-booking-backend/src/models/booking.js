const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
    },
    fromStationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    toStationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
    },
    totalFare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
    pnr: {
      type: String,
      unique: true,
      default: () => "PNR" + Date.now(),
    },
  },
  { timestamps: true, versionKey: false }
);

// For fast availability check
BookingSchema.index({ trainId: 1, travelDate: 1 });

const booking = mongoose.model("Booking", BookingSchema);

module.exports = booking;
