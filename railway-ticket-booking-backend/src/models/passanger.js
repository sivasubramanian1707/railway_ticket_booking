const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["MALE", "FEMALE"],
    required: true,
  },
});

module.exports = mongoose.model("Passenger", PassengerSchema);
