const { Notice, User } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

// not ready art all
const getFavoriteNotices = async (req, res) => {
  const { _id: ownerId } = req.user;

  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const user = await User.findById(ownerId);
  console.log(user, "user");
  if (!user) {
    throw new RequestError(404, `User with id: ${ownerId} is not found`);
  }

  const notices = await Notice.find({ ownerId: { $in: user.favorite } })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  // .populate("owner", "name email phone");

  // const totalCount = await Notice.countDocuments({
  //   _id: { $in: user.favorite },
  // });

  res.status(200).json({
    result: notices,
    hits: notices.length,
    // totalHits: totalCount,
  });
};

module.exports = { getFavoriteNotices: ctrlWrapper(getFavoriteNotices) };
