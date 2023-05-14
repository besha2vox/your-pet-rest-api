const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const { RequestError } = require("../helpers");
const { controllerWrap } = require("../utils/validation");
const { v4: uuidv4 } = require("uuid");
const gravatar = require("gravatar");
// const fs = require("fs/promises");
// const path = require("path");
// const { sendEmail } = require("../helpers");

const { SECRET_KEY } = process.env;

// const avatarDir = path.join(__dirname, "../", "public", "avatars");

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
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  try {
    const result = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    // const verifyEmail = {
    //   to: email,
    //   subject: "Сonfirmation of registration",
    //   html: `<a target="_blank" href="http://localhost:3001/api/users/verify/${verificationToken}">Click to confirm registration</a>`,
    // };

    // await sendEmail(verifyEmail);

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

// const resendVerifyEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw RequestError(404, "User not found");
//   }

//   // const verifyEmail = {
//   //   to: email,
//   //   subject: "Сonfirmation of registration",
//   //   html: `<a target="_blank" href="http://localhost:3001/api/users/verify/${user.verificationToken}">Click to confirm registration</a>`,
//   // };

//   // await sendEmail(verifyEmail);

//   res.status(200).json({ message: "Verification email sent" });
// };

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const data = req.body;
  const updatedData = await User.findByIdAndUpdate(_id, data, { new: true });
  if (!updatedData) {
    throw RequestError(401, "Not authorized");
  }
  res.status(200).json(updatedData);
};

// const updateAvatar = async (req, res) => {
//   const { _id } = req.user;
//   const { path: tmpUpload, filename } = req.file;

//   await resizeImg(tmpUpload, 250, 250);

//   const avatarName = `${_id}_${filename}`;
//   const resultUpload = path.join(avatarDir, avatarName);

//   await fs.rename(tmpUpload, resultUpload);

//   const avatarURL = path.join("avatars", avatarName);

//   await User.findByIdAndUpdate(_id, { avatarURL });

//   res.status(200).json({ avatarURL });
// };

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
  // updateAvatar: controllerWrap(updateAvatar),
  // resendVerifyEmail: controllerWrap(resendVerifyEmail),
};
