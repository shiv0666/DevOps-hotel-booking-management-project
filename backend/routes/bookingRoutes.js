const express = require("express");
const router = express.Router();
const { 
  createBooking, 
  checkAvailability, 
  getMyBookings,
  getHotelBookings,
  approveBooking,
  rejectBooking
} = require("../controllers/bookingController");
const { protect, customerOnly, staffOnly } = require("../middleware/authMiddleware");

// Customer routes
router.post("/check", protect, checkAvailability);
router.post("/", protect, customerOnly, createBooking);
router.get("/my", protect, customerOnly, getMyBookings);

// Staff routes
router.get("/pending", protect, staffOnly, getHotelBookings);
router.put("/:bookingId/approve", protect, staffOnly, approveBooking);
router.put("/:bookingId/reject", protect, staffOnly, rejectBooking);

module.exports = router;
