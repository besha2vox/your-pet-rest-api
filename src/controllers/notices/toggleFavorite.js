const { User, Notice } = require("../../models");

const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const toggleFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: noticeId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new RequestError(404, `User with id: ${userId} not found`);
  }
  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw new RequestError(404, `notice with id: ${noticeId} not found`);
  }

  // check if noticeId is already in favorite array
  const index = user.favorite.indexOf(noticeId);
  let updatedUser = {};
  if (index === -1) {
    // Add noticeId to the favorite array field in User model
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { favorite: noticeId } },
      { new: true }
    ).populate(
      "favorite",
      "titleOfAdd avatarURL category name birthday breed location price sex comments"
    );
    await Notice.findByIdAndUpdate(
      noticeId,
      { $push: { favorite: userId } },
      { new: true }
    );
  } else {
    // Remove noticeId from the favorite array field in User model
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorite: { $eq: noticeId } } },
      { new: true }
    ).populate(
      "favorite",
      "titleOfAdd avatarURL category name birthday breed location price sex comments"
    );

    await Notice.findByIdAndUpdate(
      noticeId,
      { $pull: { favorite: { $eq: userId } } },
      { new: true }
    );
  }
  updatedUser.password = undefined;
  res.json({
    status: "success",
    code: 200,
    data: {
      result: updatedUser,
    },
  });
};

module.exports = { toggleFavorite: ctrlWrapper(toggleFavorite) };
