const mongoose = require("mongoose");

const roomTypeSchema = new mongoose.Schema({
  type: { type: String, required: true },
  totalRooms: { type: Number, default: 10 },
  price: { type: Number, required: true }
});

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, default: "" },
  description: { type: String, default: "" },
  roomTypes: [roomTypeSchema]
}, { timestamps: true });

module.exports = mongoose.model("Hotel", hotelSchema);
