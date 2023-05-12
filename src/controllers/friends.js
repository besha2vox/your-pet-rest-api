const { Friends } = require("../db/models");

const getAllFriends = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Friends.find({}, "", {
    skip,
    limit: Number(limit),
  });
  res.json({
    result,
  });
};

module.exports = { getAllFriends };
