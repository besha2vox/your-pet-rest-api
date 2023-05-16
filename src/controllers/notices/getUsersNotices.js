const { Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const getUsersNotices = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  console.log(owner, "owner");
  const notices = await Notice.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  })
    .sort({ createdAt: -1 })
    .populate("owner", "name email phone");

  if (!notices) {
    throw new RequestError(404, `no match for your request`);
  }

  res.status(201).json({
    result: notices,
  });
};

module.exports = { getUsersNotices: ctrlWrapper(getUsersNotices) };
