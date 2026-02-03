require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || '';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.argv[2] || 'admin@hotel.com';

if (!MONGO_URI) {
  console.error('ERROR: set MONGO_URI in environment or in a .env file');
  process.exit(1);
}

async function isBcryptHash(str) {
  return typeof str === 'string' && /^\$2[aby]\$\d{2}\$/.test(str);
}

async function main() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = await User.findOne({ email: ADMIN_EMAIL });
  if (!user) {
    console.error(`No user found with email ${ADMIN_EMAIL}`);
    process.exit(1);
  }

  if (await isBcryptHash(user.password)) {
    console.log('Password already appears to be bcrypt-hashed. No changes made.');
    console.log(`User: ${user.email} (${user.role})`);
    process.exit(0);
  }

  console.log('Detected non-hashed password for user:', user.email);
  const plain = user.password;
  const hashed = await bcrypt.hash(plain, 10);

  user.password = hashed;
  await user.save();

  console.log('Updated user password to bcrypt hash for:', user.email);
  console.log('You can now login with the original password (unchanged by this script).');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
