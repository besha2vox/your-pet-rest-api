const { News } = require("../db/models");
const { RequestError } = require("../helpers");
const { ctrlWrapper } = require("../middlewares");

const getAllNews = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  const result = await News.find({}, "", {
    skip,
    limit: Number(limit),
  }).sort({ date: -1 });
  const totalHints = await News.count();

  res.status(200).json({
    result,
    page: Number(page),
    hints: Number(limit),
    totalHints,
  });
};

const getNewsByQuery = async (req, res) => {
  const { page = 1, limit = 6, query } = req.query;
  const skip = (page - 1) * limit;
  const searchWords = query.trim().split(" ");
  const regexExpressions = searchWords.map((word) => new RegExp(word, "i"));

  const result = await News.find(
    {
      $and: [
        {
          $or: regexExpressions.map((expression) => ({
            title: { $regex: expression },
          })),
        },
      ],
    },
    "imgUrl title text date url",
    {
      skip,
      limit: Number(limit),
    }
  ).sort({ date: -1 });

  if (!result || result.length === 0) {
    throw new RequestError(404, `No match for your search`);
  }

  const totalHints = await News.count({
    $and: [
      {
        $or: regexExpressions.map((expression) => ({
          title: { $regex: expression },
        })),
      },
    ],
  });

  res.status(200).json({
    result,
    page: Number(page),
    hints: Number(limit),
    totalHints,
  });
};

module.exports = {
  getAllNews: ctrlWrapper(getAllNews),
  getNewsByQuery: ctrlWrapper(getNewsByQuery),
};
