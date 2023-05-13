const { addNotice } = require("./addNotice");
const { addToFavorite } = require("./addToFavorite");
const { getByCategory } = require("./getByCategory");
const { getFavoriteNotices } = require("./getFavoriteNotices");
const { getNoticeById } = require("./getNoticeById");
const { getUsersNotices } = require("./getUsersNotices");
const { removeFromFavorite } = require("./removeFromFavorite");
const { removeNotice } = require("./removeNotice");
const { searchByTitle } = require("./searchByTitle");
// const { updateNotice } = require("./updateNotice");

module.exports = {
  addNotice,
  addToFavorite,
  getByCategory,
  getFavoriteNotices,
  getNoticeById,
  getUsersNotices,
  removeFromFavorite,
  removeNotice,
  searchByTitle,
  // updateNotice,
};
