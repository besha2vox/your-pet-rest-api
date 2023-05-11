const { News } = require("../models");

const getAllNews = async (req, res) => {
  const result = await News.find();
  res.json({
    status: "success",
    code: 200,
    data: { result },
  });
};

module.exports = { getAllNews };
