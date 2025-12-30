const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema(
  {
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },

    arrivalTime: {
      type: String, // "14:30"
      default: null,
    },

    departureTime: {
      type: String, // "14:40"
      default: null,
    },

    order: {
      type: Number, // 1,2,3...
      required: true,
    },

    // 💰 Fare from THIS station to NEXT station
    fareToNext: {
      type: Number,
      default: 0, // last station
    },
  },
  { _id: false }
);

const TrainRouteSchema = new mongoose.Schema(
  {
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Train",
      required: true,
      unique: true,
    },

    stops: {
      type: [StopSchema],
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const trainRoute = mongoose.model("TrainRoute", TrainRouteSchema);

module.exports = trainRoute;
