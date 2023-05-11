const { Notice, User } = require("../../models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

// not ready art all
const getFavoriteNotices = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const user = await User.findById(owner);

  if (!user) {
    throw new RequestError(404, `User with id: ${owner} is not found`);
  }

  const notices = await Notice.find({ _id: { $in: user.favorite } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "name email phone");

  res.status(200).json({
    status: "success",
    code: 200,
    data: {
      result: notices,
    },
  });
};

module.exports = { getFavoriteNotices: ctrlWrapper(getFavoriteNotices) };
