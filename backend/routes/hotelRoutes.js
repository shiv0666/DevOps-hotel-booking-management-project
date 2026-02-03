const express = require("express");
const router = express.Router();
const { listHotels } = require("../controllers/hotelController");
const { protect } = require("../middleware/authMiddleware");

// Everyone can list hotels
router.get("/", protect, listHotels);

module.exports = router;
