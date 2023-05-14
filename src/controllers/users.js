const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const { RequestError } = require("../helpers");
const { controllerWrap } = require("../utils/validation");
const { v4: uuidv4 } = require("uuid");

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

  const verificationToken = uuidv4();
  try {
    const result = await User.create({
      ...req.body,
      password: hashPassword,
      verificationToken,
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
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new RequestError(400, "Email or password is wrong");
    }

    // if (!user.verify) {
    //   throw RequestError(401, "Email not verify");
    // }

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
    res.status(error.status || 500).json({ message: error.message || "Internal server error" });
  }
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user;
  res.json({
    username,
    email,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw RequestError(404, "User not found");
  }

  if (user.verify) {
    throw RequestError(400, "Verification has already been passed");
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

  res.status(200).json({ message: "Verification successful" });
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const data = req.body;
  const updatedData = await User.findByIdAndUpdate(_id, data, { new: true });
  if (!updatedData) {
    throw RequestError(401, "Not authorized");
  }
  res.status(200).json(updatedData);
};

const getUserInfo = async (req, res) => {
  const { _id } = req.user;
  const userInfo = await User.findById(_id).populate("pet");
  if (!userInfo) {
    throw RequestError(401, "Not authorized");
  }
  res.status(200).json({
    user: {
      username: userInfo.username,
      email: userInfo.email,
      phone: userInfo.phone,
      city: userInfo.city,
      birthday: userInfo.birthday,
      favorite: userInfo.favorite,
      pet: userInfo.pet,
    },
  });
};

const updateUserInfo = async (req, res) => {
  const { _id } = req.user;
  const data = req.body;
  const updatedData = await User.findByIdAndUpdate(_id, data).populate("pet");
  if (!updatedData) {
    throw RequestError(401, "Not authorized");
  }
  res.status(200).json(updatedData);
};

module.exports = {
  register: controllerWrap(register),
  login: controllerWrap(login),
  getCurrent: controllerWrap(getCurrent),
  logout: controllerWrap(logout),
  verify: controllerWrap(verify),
  updateUser: controllerWrap(updateUser),
  getUserInfo: controllerWrap(getUserInfo),
  updateUserInfo: controllerWrap(updateUserInfo),
};
