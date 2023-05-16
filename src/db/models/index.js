const { User } = require("./user");
const { News } = require("./news");
const { Pet, addPetJoiSchema, updatePetJoiSchema } = require("./pets");
const Notice = require("./notice");
const { Friends } = require("./friends");
const Cat = require("./cat");

module.exports = {
  User,
  News,
  Pet,
  addPetJoiSchema,
  updatePetJoiSchema,
  Notice,
  Friends,
  Cat,
};
