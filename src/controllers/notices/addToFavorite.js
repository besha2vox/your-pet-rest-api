const { User } = require("../../models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const addToFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: noticeId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new RequestError(404, `User with id: ${userId} not found`);
  }

  //   // check if noticeId is already in favorite array
  // const index = user.favorite.indexOf(noticeId);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $push: { favorite: noticeId } },
    { new: true }
  ).populate("favorite");
  res.json({
    status: "success",
    code: 201,
    data: {
      result: updatedUser,
    },
  });
};

module.exports = { addToFavorite: ctrlWrapper(addToFavorite) };
