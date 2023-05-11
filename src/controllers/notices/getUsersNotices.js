const { Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

// const imagesDir = path.join(__dirname, "../../", "public", "pets-photo");

const getUsersNotices = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const notices = await Notice.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  }).populate("owner", "name email phone");

  if (!notices) {
    throw new RequestError(404, `no match for your request`);
  }

  res.status(201).json({
    status: "success",
    code: 200,
    data: {
      result: notices,
    },
  });
};

module.exports = { getUsersNotices: ctrlWrapper(getUsersNotices) };
