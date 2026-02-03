require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || '';
if (!MONGO_URI) {
  console.error('ERROR: set MONGO_URI in environment or in a .env file');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const email = 'admin@hotel.com';
  const plainPassword = 'admin123';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(plainPassword, 10);
  const adminData = {
    name: 'Admin User',
    email,
    password: hashed,
    role: 'ADMIN',
    hotelId: null,
  };

  const admin = await User.create(adminData);
  console.log('Created admin user:');
  console.log({ id: admin._id.toString(), email: admin.email, role: admin.role });
  console.log('\nNow login with the credentials:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${plainPassword}`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
