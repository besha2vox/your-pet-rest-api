const { Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const getByCategory = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const { category } = req.params;

  const notices = await Notice.find(
    { category: { $regex: `^${category}`, $options: "i" } },
    "-createdAt -updatedAt",
    {
      skip,
      limit: Number(limit),
    }
  ).sort({ createdAt: -1 });

  if (!notices) {
    throw new RequestError(404, `no match for your request`);
  }
  const totalCount = await Notice.countDocuments({
    category: { $regex: `^${category}`, $options: "i" },
  });

  res.status(201).json({
    status: "success",
    code: 200,
    data: {
      result: notices,
      totalResults: totalCount,
    },
  });
};

module.exports = { getByCategory: ctrlWrapper(getByCategory) };
