const { User, Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const addToFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { id: noticeId } = req.params;
  // const userId = "645d44e852a326e402ebf651";

  const user = await User.findById(userId);
  if (!user) {
    throw new RequestError(404, `User with id: ${userId} not found`);
  }
  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw new RequestError(404, `notice with id: ${noticeId} not found`);
  }

  console.log(notice.favorite, "user.favorite");
  // check if noticeId is already in favorite array
  const index = notice.favorite.indexOf(userId);
  console.log(index);
  if (index !== -1) {
    return res.json({
      message: `User with id ${userId} already has this notice  in favorite list`,
    });
  }

  await User.findByIdAndUpdate(
    userId,
    { $push: { favorite: noticeId } },
    { new: true }
  );

  const updatedNotice = await Notice.findByIdAndUpdate(
    noticeId,
    { $push: { favorite: userId } },
    { new: true }
  );

  res.json({
    result: {
      updatedNotice,
    },
  });
};

module.exports = { addToFavorite: ctrlWrapper(addToFavorite) };
