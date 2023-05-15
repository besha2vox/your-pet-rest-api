const { Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const updateNotice = async (req, res) => {
  const { _id: ownerId } = req.user;
  const { id: noticeId } = req.params;

  if (!req.body) {
    throw new RequestError(422, `there is no body content`);
  }

  const notice = await Notice.findById(noticeId);
  if (!notice) {
    throw new RequestError(404, `Notice with id: ${noticeId} is not found`);
  }

  if (notice.owner?.toString() !== ownerId?.toString()) {
    throw new RequestError(
      403,
      `User has no access to update the notice with id  ${noticeId}`
    );
  }

  const noticeData = await req.body;

  const data = req.file
    ? { ...noticeData, avatarURL: req.file.path }
    : { ...noticeData };
  console.log(data, "data");

  const updatedNotice = await Notice.findByIdAndUpdate(noticeId, data, {
    new: true,
  });

  if (!updatedNotice) {
    throw new RequestError(400, `Error: notice is not updated`);
  }

  res.status(201).json({
    result: updatedNotice,
  });
};

module.exports = { updateNotice: ctrlWrapper(updateNotice) };
