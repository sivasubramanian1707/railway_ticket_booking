const mongoose = require("mongoose");

const TrainSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      unique: true,
    },
    trainName: {
      type: String,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true, versionKey: false }
);

const train = mongoose.model("Train", TrainSchema);

module.exports = train;
