const validation = require("./validation");
const ctrlWrapper = require("./ctrlWrapper");
const isValidId = require("./isValidId");
const auth = require("./auth");
const uploadCloud = require("./uploadCloud");
const { filterByQueries } = require("./filterByQueries");

const {
  noticeValidation,
  updateNoticeValidation,
} = require("./noticeJoiValidation");

module.exports = {
  validation,
  ctrlWrapper,
  isValidId,
  auth,
  uploadCloud,
  noticeValidation,
  updateNoticeValidation,
  filterByQueries,
};
