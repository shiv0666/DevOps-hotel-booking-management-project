const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

// CUSTOMER: Create booking (status = PENDING)
const createBooking = async (req, res) => {
  try {
    // Only customers can create bookings
    if (req.user.role !== "CUSTOMER") {
      return res.status(403).json({ message: "Only customers can create bookings" });
    }

    const { hotelId, roomType, rooms = 1, checkIn, checkOut, guests, price, contactInfo } = req.body;
    const booking = await Booking.create({
      user: req.user._id,
      hotel: hotelId,
      roomType,
      rooms,
      checkIn,
      checkOut,
      guests,
      price,
      contactInfo,
      status: "PENDING"
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const { hotelId, roomType, checkIn, checkOut, rooms = 1 } = req.body;
    if (!hotelId || !roomType || !checkIn || !checkOut) {
      return res.status(400).json({ message: "hotelId, roomType, checkIn and checkOut required" });
    }
    const hotel = await Hotel.findById(hotelId).lean();
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    const rt = hotel.roomTypes.find(r => r.type.toLowerCase() === roomType.toLowerCase());
    if (!rt) return res.status(404).json({ message: "Room type not found" });
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    // Only count CONFIRMED bookings when checking availability
    const overlapping = await Booking.aggregate([
      { 
        $match: { 
          hotel: hotel._id, 
          roomType: rt.type, 
          status: "CONFIRMED",
          $or: [ { $and: [ { checkIn: { $lt: co } }, { checkOut: { $gt: ci } } ] } ] 
        } 
      },
      { $group: { _id: null, totalBooked: { $sum: "$rooms" } } }
    ]);
    const totalBooked = overlapping.length ? overlapping[0].totalBooked : 0;
    const availableRooms = rt.totalRooms - totalBooked;
    const ok = availableRooms >= rooms;
    res.json({ hotelId, roomType: rt.type, requested: rooms, availableRooms, ok, price: rt.price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CUSTOMER: Get my bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("hotel").sort("-createdAt");
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// STAFF: Get all pending bookings (system-wide)
const getHotelBookings = async (req, res) => {
  try {
    // Only staff can access this
    if (req.user.role !== "STAFF") {
      return res.status(403).json({ message: "Only staff can access pending bookings" });
    }

    // Return all pending bookings across hotels
    const bookings = await Booking.find({ status: "PENDING" })
      .populate("user", "name email")
      .populate("hotel", "name location")
      .sort("-createdAt");

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// STAFF: Approve booking (mark as CONFIRMED)
const approveBooking = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({ message: "Only staff can approve bookings" });
    }

    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({ message: "Only pending bookings can be approved" });
    }

    booking.status = "CONFIRMED";
    booking.approvedBy = req.user._id;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// STAFF: Reject booking
const rejectBooking = async (req, res) => {
  try {
    if (req.user.role !== "STAFF") {
      return res.status(403).json({ message: "Only staff can reject bookings" });
    }

    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "PENDING") {
      return res.status(400).json({ message: "Only pending bookings can be rejected" });
    }

    booking.status = "REJECTED";
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
  createBooking, 
  checkAvailability, 
  getMyBookings,
  getHotelBookings,
  approveBooking,
  rejectBooking
};
