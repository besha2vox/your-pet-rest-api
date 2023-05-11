const { Notice } = require("../../db/models");

const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");
// returns only 10 objects. wtf??
const searchByTitle = async (req, res) => {
  const { page = 1, limit = 12, q } = req.query;
  const skip = (page - 1) * limit;
  const { category = "sell" } = req.params;

  const searchWords = q.trim().split(" ");

  const regexExpressions = searchWords.map((word) => new RegExp(word, "i"));
  const notices = await Notice.find(
    {
      $and: [
        { category },
        {
          $or: regexExpressions.map((expression) => ({
            titleOfAdd: { $regex: expression },
          })),
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
  const totalCount = await Notice.countDocuments({
    $and: [
      { category },
      {
        $or: regexExpressions.map((expression) => ({
          titleOfAdd: { $regex: expression },
        })),
      },
    ],
  });

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      result: notices,
      totalResults: totalCount,
    },
  });
};

module.exports = { searchByTitle: ctrlWrapper(searchByTitle) };
