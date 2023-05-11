const { Notice } = require("../../models");

const { RequestError } = require("../../helpers/requestError");
const { ctrlWrapper } = require("../../middlewares");

const searchByTitle = async (req, res) => {
  const { page = 1, limit = 12, q } = req.query;
  const skip = (page - 1) * limit;
  const { category = "sell" } = req.params;

  const searchWords = q.trim().split(" ");

  const notices = await Notice.find(
    {
      $and: [{ category }, { titleOfAdd: { $in: searchWords } }],
    },
    "-createdAt -updatedAt",
    {
      skip,
      limit: Number(limit),
    }
  );
  if (!notices || notices.length === 0) {
    throw new RequestError(404, `no match for your search`);
  }

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      result: notices,
    },
  });
};

module.exports = { searchByTitle: ctrlWrapper(searchByTitle) };
