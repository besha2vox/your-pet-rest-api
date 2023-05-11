const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/models");
const { controllerWrap } = require("../utils/validation");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const result = await User.create({
      ...req.body,
      password: hashPassword,
    });

    const payload = {
      id: result._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
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
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register: controllerWrap(register),
};
