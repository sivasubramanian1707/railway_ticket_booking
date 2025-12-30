const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

//configration
const PORT = process.env.PORT || 4000;
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log(`Database connected successfully!`))
  .catch((error) => console.log(error.message));

app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cors());

// Routes

const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");

app.use("/auth", authRoute);
app.use("/admin", adminRoute);

app.listen(PORT, () => console.log(`Server running on ${process.env.PORT}`));
