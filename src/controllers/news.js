const { News } = require("../db/models");

const getAllNews = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  const result = await News.find({}, "", {
    skip,
    limit: Number(limit),
  });
  res.json({
    result,
  });
};

module.exports = { getAllNews };
