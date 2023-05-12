const { Friends } = require("../db/models");

const getAllFriends = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Friends.find({}, "", {
    skip,
    limit: Number(limit),
  });
  const totalHints = await Friends.count();

  res.status(200).json({
    result,
    page: Number(page),
    hints: Number(limit),
    totalHints,
  });
};

module.exports = { getAllFriends };
