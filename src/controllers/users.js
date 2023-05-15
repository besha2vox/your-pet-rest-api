const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Pet } = require("../db/models");

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
  const data = await req.body;

  const updatedUserData = await User.findByIdAndUpdate(_id, data, { new: true });

  if (!updatedUserData) {
    throw new RequestError(400, `Error: user is not updated`);
  }

  res.status(200).json({ result: updatedUserData });
};

const getUserInfo = async (req, res) => {
  const { _id } = req.user;
  const userInfo = await User.findById(_id);

  if (!userInfo) {
    throw RequestError(401, "Not authorized");
  }
  const userPets = await Pet.find({ owner: _id });

  if (!userPets) {
    throw new RequestError(404, `no match for your request`);
  }

  res.status(200).json({
    user: {
      username: userInfo.username,
      email: userInfo.email,
      phone: userInfo.phone,
      city: userInfo.city,
      birthday: userInfo.birthday,
      pet: userPets,
    },
  });
};

const updateUserPets = async (req, res) => {
  const { _id: ownerId } = req.user;
  const { id: petId } = req.params;
  if (!req.body) {
    throw new RequestError(422, `there is no body content`);
  }
  const pet = await Pet.findById(petId);
  if (!pet) {
    throw new RequestError(404, `Pet with id: ${petId} is not found`);
  }
  if (pet.owner?.toString() !== ownerId?.toString()) {
    throw new RequestError(403, `User has no access to update the pet with id  ${petId}`);
  }
  const petData = await req.body;
  const data = req.file ? { ...petData, avatarURL: req.file.path } : { ...petData };

  const updateUserPet = await Pet.findByIdAndUpdate(petId, data, { new: true });

  if (!updateUserPet) {
    throw new RequestError(400, `Error: notice is not updated`);
  }

  res.status(200).json({ result: updateUserPet });
};

module.exports = {
  register: controllerWrap(register),
  login: controllerWrap(login),
  getCurrent: controllerWrap(getCurrent),
  logout: controllerWrap(logout),
  verify: controllerWrap(verify),
  updateUser: controllerWrap(updateUser),
  getUserInfo: controllerWrap(getUserInfo),
  updateUserPets: controllerWrap(updateUserPets),
};
