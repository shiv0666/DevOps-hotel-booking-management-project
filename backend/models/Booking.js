const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomType: { type: String, required: true },
    rooms: { type: Number, default: 1 },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, default: 1 },
    price: { type: Number, required: true },
    status: { type: String, enum: ["PENDING", "CONFIRMED", "REJECTED"], default: "PENDING" },
    approvedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: false 
    },
    contactInfo: {
      phone: { type: String },
      notes: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
