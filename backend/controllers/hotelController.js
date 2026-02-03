const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

// ADMIN ONLY: Create hotel
const createHotel = async (req, res) => {
  try {
    // Check if user is ADMIN
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can create hotels" });
    }

    const { name, location, description, roomTypes } = req.body;
    if (!name || !roomTypes || roomTypes.length === 0) {
      return res.status(400).json({ message: "Name and at least one room type are required" });
    }
    const hotel = new Hotel({ name, location, description, roomTypes });
    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Anyone can view hotels (Customer, Admin, Staff)
const listHotels = async (req, res) => {
  try {
    const { location, roomType, minPrice, maxPrice, checkIn, checkOut } = req.query;
    const filter = {};
    if (location) filter.location = new RegExp(location, "i");
    let hotels = await Hotel.find(filter).lean();
    hotels = hotels.map(h => {
      let types = h.roomTypes;
      if (roomType) types = types.filter(t => t.type.toLowerCase() === roomType.toLowerCase());
      if (minPrice) types = types.filter(t => t.price >= Number(minPrice));
      if (maxPrice) types = types.filter(t => t.price <= Number(maxPrice));
      return { ...h, roomTypes: types };
    }).filter(h => h.roomTypes.length > 0);
    if (checkIn && checkOut) {
      const ci = new Date(checkIn);
      const co = new Date(checkOut);
      for (const h of hotels) {
        for (const rt of h.roomTypes) {
          const overlapping = await Booking.countDocuments({
            hotel: h._id,
            roomType: rt.type,
            status: "APPROVED",
            $or: [ { checkIn: { $lt: co }, checkOut: { $gt: ci } } ]
          });
          rt.bookedCount = overlapping;
          rt.available = (rt.totalRooms - overlapping) > 0;
        }
      }
    }
    res.json(hotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN ONLY: Seed hotels
const seedHotels = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can seed hotels" });
    }

    const count = await Hotel.countDocuments();
    if (count > 0) {
      const all = await Hotel.find().lean();
      return res.json({ seeded: false, hotels: all });
    }
    const sample = [
      { name: "River View Hotel", location: "Kolkata", description: "Cozy riverside hotel.", roomTypes: [ { type: "Deluxe", totalRooms: 5, price: 3000 }, { type: "Suite", totalRooms: 2, price: 7000 } ] },
      { name: "City Center Inn", location: "Kolkata", description: "Central location, easy access.", roomTypes: [ { type: "Standard", totalRooms: 10, price: 1500 }, { type: "Deluxe", totalRooms: 4, price: 3500 } ] }
    ];
    const created = await Hotel.insertMany(sample);
    res.json({ seeded: true, hotels: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createHotel, listHotels, seedHotels };
