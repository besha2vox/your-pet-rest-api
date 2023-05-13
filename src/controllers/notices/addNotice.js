const { Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const addNotice = async (req, res) => {
  const { _id: owner } = req.user;

  const { category } = req.params;
  if (!req.body) {
    throw new RequestError(400, `there is no body content`);
  }
  const noticeData = req.body;
  console.log(noticeData, "noticeData");
  if (!req.file) {
    throw new RequestError(400, `no file uploaded`);
  }

  const data = req.file
    ? { owner, ...noticeData, category, avatarURL: req.file.path }
    : { owner, ...noticeData, category };

  const notice = await Notice.create(data);
  if (!notice) {
    throw new RequestError(400, `error: notice is not created`);
  }
  res.status(201).json({
    result: notice,
  });
};

module.exports = { addNotice: ctrlWrapper(addNotice) };
