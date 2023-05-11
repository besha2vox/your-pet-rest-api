const { User, schemas } = require("./user");
const { News } = require("./news");
const { Pet, addPetJoiSchema } = require("./pet");
const { Notice, addNoticeJoiSchema } = require("./notice");

module.exports = {
  User,
  News,
  Pet,
  Notice,
  addPetJoiSchema,
  addNoticeJoiSchema,
  schemas,
};
