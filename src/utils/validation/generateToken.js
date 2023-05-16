const jwt = require("jsonwebtoken");

const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const generateToken = (id) => {
  const payload = {
    id,
  };
  const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "10m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

module.exports = generateToken;
