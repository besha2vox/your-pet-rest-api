const { Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const getNoticeById = async (req, res) => {
  const { id } = req.params;
  const notice = await Notice.findById(id);
  if (!notice) {
    throw new RequestError(404, `Notice with id: ${id} is not found`);
  }
  res.json({
    result: notice,
  });
};

module.exports = { getNoticeById: ctrlWrapper(getNoticeById) };
