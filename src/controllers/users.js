const bcrypt = require("bcrypt");
const { User } = require("../models");
const { controllerWrap } = require("../utils/validation");

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

    res.status(201).json({
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
