const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
  },
  { timestamps: true, versionKey: false }
);
const station = mongoose.model("Station", StationSchema);
module.exports = station;
