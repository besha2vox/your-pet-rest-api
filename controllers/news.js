const { News } = require("../models");

const getAllNews = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  const data = await News.find({}, "", {
    skip,
    limit: Number(limit),
  });
  res.json({
    data,
  });
};

module.exports = { getAllNews };
