const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["admin", "user", "manager"], // 👈 allowed values
      default: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

const user = mongoose.model("User", UserSchema);

module.exports = user;
