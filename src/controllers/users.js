const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const { RequestError } = require("../helpers");
const { controllerWrap } = require("../utils/validation");

const { SECRET_KEY } = process.env;

const generateToken = (id) => {
  const payload = {
    id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  return token;
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new RequestError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const result = await User.create({
      ...req.body,
      password: hashPassword,
    });

    const token = generateToken(result._id);
    await User.findByIdAndUpdate(result._id, { token });

    res.status(201).json({
      token,
      user: {
        username: result.username,
        email: result.email,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new RequestError(400, "Email or password is wrong");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new RequestError(400, "Email or password is wrong");
    }

    const token = generateToken(user._id);
    await User.findByIdAndUpdate(user._id, { token });

    res.status(201).json({
      token,
      user: {
        username: user.username,
        email,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  register: controllerWrap(register),
  login: controllerWrap(login),
};
