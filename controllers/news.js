const getAllNews = async (req, res) => {
  res.json({
    status: "success",
    code: 200,
    data: "Get All News Controller",
  });
};

module.exports = { getAllNews };
