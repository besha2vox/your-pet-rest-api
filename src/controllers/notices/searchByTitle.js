const { Notice } = require("../../db/models");

const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const searchByTitle = async (req, res) => {
  const { page = 1, limit = 12, q = "" } = req.query;
  const skip = (page - 1) * limit;
  const { category = "sell" } = req.params;

  const searchWords = q.trim().split(" ");

  const regexExpressions = searchWords.map((word) => ({
    titleOfAdd: { $regex: new RegExp(word, "i") },
  }));

  const notices = await Notice.find(
    {
      $and: [
        { category },
        {
          $or: regexExpressions,
        },
      ],
    },
    "-createdAt -updatedAt",
    {
      skip,
      limit: Number(limit),
    }
  ).sort({ createdAt: -1 });

  if (!notices || notices.length === 0) {
    throw new RequestError(404, `no match for your search`);
  }
  const totalHits = await Notice.countDocuments({
    $and: [
      { category },
      {
        $or: regexExpressions,
      },
    ],
  });

  res.status(200).json({
    result: notices,
    hits: notices.length,
    totalHits: totalHits,
  });
};

module.exports = { searchByTitle: ctrlWrapper(searchByTitle) };
