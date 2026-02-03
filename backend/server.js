require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const hotelRoutes = require("./routes/hotelRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// connect DB (use MONGO_URI from .env or local default)
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/hotel_booking_db";
connectDB(mongoUri);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/hotels", hotelRoutes);

app.get("/", (req, res) => res.send("Hotel Booking API running"));

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
