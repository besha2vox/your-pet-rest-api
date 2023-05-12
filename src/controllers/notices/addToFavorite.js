const { User, Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const addToFavorite = async (req, res) => {
  // const { _id: userId } = req.user;
  const { id: noticeId } = req.params;
  const userId = "645d2f7a502bb608851a31f4";

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
  );
  // .populate({ path: "favorite", options: { strictPopulate: false } });

  const updatedNotice = await Notice.findByIdAndUpdate(
    noticeId,
    { $push: { favorite: userId } },
    { new: true }
  ).populate("favorite", "_id");

  res.json({
    status: "success",
    code: 201,
    data: {
      result: {
        updatedUser,
        updatedNotice,
      },
    },
  });
};

module.exports = { addToFavorite: ctrlWrapper(addToFavorite) };
