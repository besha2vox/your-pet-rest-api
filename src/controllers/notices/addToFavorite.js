const { User, Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const addToFavorite = async (req, res) => {
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

  const index = notice.favorite.indexOf(userId);

  if (index !== -1) {
    return res.json({
      message: `User with id ${userId} already has this notice  in favorite list`,
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { favorite: noticeId } },
    { new: true }
  ).populate(
    "favorite",
    "titleOfAdd avatarURL category name birthday breed location price sex comments"
  );

  updatedUser.password = undefined;

  await Notice.findByIdAndUpdate(
    noticeId,
    { $push: { favorite: userId } },
    { new: true }
  );

  res.json({
    result: {
      updatedUser,
    },
  });
};

module.exports = { addToFavorite: ctrlWrapper(addToFavorite) };
