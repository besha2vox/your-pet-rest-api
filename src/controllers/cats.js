const { Cat } = require("../db/models");
const { RequestError } = require("../helpers");
const { ctrlWrapper } = require("../middlewares");

async function addCat(req, res) {
  const { _id: owner } = req.user;

  if (!req.body) {
    throw new RequestError(400, `The text fields are not filled in`);
  }
  if (!req.file) {
    throw new RequestError(400, `The file is not loaded`);
  }

  const result = await Cat.create({
    ...req.body,
    avatarURL: req.file.path,
    owner,
  });
  res.status(201).json({
    message: "Information about the cat was added",
    result,
  });
}

async function deleteCatById(req, res) {
  const { id } = req.params;

  const result = await Cat.findByIdAndDelete(id);
  if (!result) {
    throw new RequestError(404, `Cat with id ${id} not found`);
  }
  res.status(200).json({
    message: "The cat was deleted",
    result,
  });
}

const getAllCats = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Cat.find({}, "", {
    skip,
    limit: Number(limit),
  });
  const totalHints = await Cat.count();

  res.status(200).json({
    result,
    page: Number(page),
    hints: Number(limit),
    totalHints,
  });
};

module.exports = {
  addCat: ctrlWrapper(addCat),
  deleteCatById: ctrlWrapper(deleteCatById),
  getAllCats: ctrlWrapper(getAllCats),
};
