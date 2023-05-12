const { User, Notice } = require("../../db/models");

const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const removeFromFavorite = async (req, res) => {
  // const { _id: userId } = req.user;
  const { id: noticeId } = req.params;
  const userId = "645d2f7a502bb608851a31f4";

  const user = await User.findById(userId);
  if (!user) {
    throw new RequestError(404, `User with id: ${userId} not found`);
  }

  // Remove noticeId from the favorite array field in User model
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { favorite: noticeId } },
    { new: true }
  );
  // .populate("favorite");

  const updatedNotice = await Notice.findByIdAndUpdate(
    noticeId,
    { $pull: { favorite: userId } },
    { new: true }
  );

  res.json({
    result: { updatedUser, updatedNotice },
  });
};

module.exports = { removeFromFavorite: ctrlWrapper(removeFromFavorite) };
