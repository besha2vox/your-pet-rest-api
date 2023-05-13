const { Notice, User } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const getFavoriteNotices = async (req, res) => {
  const { _id: ownerId } = req.user;

  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const user = await User.findById(ownerId);
  if (!user) {
    throw new RequestError(404, `User with id: ${ownerId} is not found`);
  }
  const favoriteNotices = user.favorite;
  console.log(favoriteNotices, "favoriteNotices");

  const notices = await Notice.find(
    { _id: { $in: favoriteNotices } },
    "-favorite"
  )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "name ");

  const totalCount = await Notice.countDocuments({
    _id: { $in: favoriteNotices },
  });

  res.status(200).json({
    result: notices,
    hits: notices.length,
    totalHits: totalCount,
  });
};

module.exports = { getFavoriteNotices: ctrlWrapper(getFavoriteNotices) };
