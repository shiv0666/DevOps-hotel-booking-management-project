const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || "changeme";
  const expires = process.env.TOKEN_EXPIRES_IN || "7d";
  
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email
  };
  
  if (user.hotelId) {
    payload.hotelId = user.hotelId;
  }
  
  return jwt.sign(payload, secret, { expiresIn: expires });
};

module.exports = generateToken;
