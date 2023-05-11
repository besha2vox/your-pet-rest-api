const { User } = require("../../models");
const { ctrlWrapper } = require("../../utils");
const { RequestError } = require("../../errorHandlers/");

const toggleFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: noticeId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new RequestError(404, `User with id: ${userId} not found`);
  }

  // check if noticeId is already in favorite array
  const index = user.favorite.indexOf(noticeId);

  if (index === -1) {
    // Add noticeId to the favorite array field in User model
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { favorite: noticeId } },
      { new: true }
    ).populate("favorite");
    res.json({
      status: "success",
      code: 200,
      data: {
        result: updatedUser,
      },
    });
  } else {
    // Remove noticeId from the favorite array field in User model
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorite: noticeId } },
      { new: true }
    ).populate("favorite");
    res.json({
      status: "success",
      code: 200,
      data: {
        result: updatedUser,
      },
    });
  }
};

module.exports = { toggleFavorite: ctrlWrapper(toggleFavorite) };
