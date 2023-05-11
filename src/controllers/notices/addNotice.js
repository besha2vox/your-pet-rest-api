const { Notice } = require("../../models");
const { RequestError } = require("../../errorHandlers");
const { ctrlWrapper } = require("../../src/utils");

// const imagesDir = path.join(__dirname, "../../", "public", "pets-photo");

const addNotice = async (req, res) => {
  const { _id: owner } = req.user;
  const { category } = req.query;
  if (!req.body) {
    throw new RequestError(400, `there is no body content`);
  }
  const noticeData = req.body;

  if (!req.file) {
    throw new RequestError(400, `no file uploaded`);
  }

  const data = req.file
    ? { owner, ...noticeData, category, avatarURL: req.file.path }
    : { owner, ...noticeData, category, avatarURL: null };

  const notice = await Notice.create(data);
  if (!notice) {
    throw new RequestError(400, `error: notice is not created`);
  }
  res.status(201).json({
    status: "success",
    code: 201,
    data: {
      result: notice,
    },
  });
};

module.exports = { addNotice: ctrlWrapper(addNotice) };
