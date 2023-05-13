const { User, Notice } = require("../../db/models");

const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const removeFromFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: noticeId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new RequestError(404, `User with id: ${userId} not found`);
  }

  // Remove noticeId from the favorite array field in User model
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $pull: { favorite: { $eq: noticeId } } },
    { new: true }
  ).populate(
    "favorite",
    "titleOfAdd avatarURL category name birthday breed location price sex comments"
  );

  updatedUser.password = undefined;
  await Notice.findByIdAndUpdate(
    noticeId,
    { $pull: { favorite: { $eq: userId } } },
    { new: true }
  );

  res.json({
    result: { updatedUser },
  });
};

module.exports = { removeFromFavorite: ctrlWrapper(removeFromFavorite) };
