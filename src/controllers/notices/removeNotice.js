const { Notice } = require("../../models");

const { RequestError } = require("../../helpers/requestError");
const { ctrlWrapper } = require("../../middlewares");

const removeNotice = async (req, res) => {
  const { _id: ownerId } = req.user;

  const { id: noticeId } = req.params;

  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw new RequestError(404, `Notice with id: ${noticeId} is not found`);
  }

  if (notice.owner?.toString() !== ownerId?.toString()) {
    throw new RequestError(
      403,
      `User has no access to delete the notice with id  ${noticeId}`
    );
  }

  const removedNotice = await Notice.findByIdAndRemove(noticeId);
  if (!removedNotice) {
    throw new RequestError(404, `Notice with id: ${noticeId} is not found`);
  }

  res.status(204).json({
    status: "success",
    code: 204,
    data: {
      result: removedNotice,
    },
  });
};

module.exports = { removeNotice: ctrlWrapper(removeNotice) };
