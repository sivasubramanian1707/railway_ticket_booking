const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Configuration
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Static files
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB Connection
mongoose
  .connect(
    MONGODB_URI /* {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
  } */,
  )
  .then(() => console.log("✓ Database connected successfully"))
  .catch((error) => {
    console.error("✗ Database connection failed:", error.message);
    process.exit(1);
  });

// Routes
const authRoute = require("./routes/auth");
const adminRoute = require("./routes/admin");
const trainRoute = require("./routes/train");
const bookingRoutes = require("./routes/booking");

app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/train", trainRoute);
app.use("/api/booking", bookingRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
});
