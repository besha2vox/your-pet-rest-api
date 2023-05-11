const { Notice } = require("../../models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

// const imagesDir = path.join(__dirname, "../../", "public", "pets-photo");

const getByCategory = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const { category } = req.params;

  const notices = await Notice.find(
    { category: { $regex: `^${category}`, $options: "i" } },
    "-createdAt -updatedAt",
    {
      skip,
      limit: Number(limit),
    }
  );

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

module.exports = { getByCategory: ctrlWrapper(getByCategory) };
