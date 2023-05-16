const { Notice } = require("../../db/models");
const { RequestError } = require("../../helpers");
const { ctrlWrapper } = require("../../middlewares");

const getByCategory = async (req, res) => {
  const { page = 1, limit = 12, gender, age } = req.query;
  const skip = (page - 1) * limit;
  const { category } = req.params;

  const searchQuery = {
    category: { $regex: `^${category}`, $options: "i" },
  };
  if (gender || age) {
    const ageQuery = {};

    if (gender) {
      ageQuery.sex = gender.toLowerCase();
      console.log(ageQuery.sex, "ageQuery.sex");
    }

    if (age) {
      const today = new Date();
      const maxBirthYear = today.getFullYear() - parseInt(age) + 1;

      if (age === "1y") {
        ageQuery.birthday = {
          $gte: new Date(maxBirthYear - 1, today.getMonth(), today.getDate()),
          $lt: new Date(maxBirthYear, today.getMonth(), today.getDate()),
        };
      } else if (age === "2y") {
        ageQuery.birthday = {
          $lt: new Date(maxBirthYear - 2, today.getMonth(), today.getDate()),
        };
      } else if (age === "3m-12m") {
        ageQuery.birthday = {
          $gte: new Date(
            maxBirthYear - 1,
            today.getMonth() - 3,
            today.getDate()
          ),
          $lt: new Date(maxBirthYear, today.getMonth(), today.getDate()),
        };
      } else {
        throw new RequestError(404, `wrong age parameter`);
      }
    }

    Object.assign(searchQuery, ageQuery);
  }
  const notices = await Notice.find(searchQuery, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  }).sort({ createdAt: -1 });

  if (!notices) {
    throw new RequestError(404, `no match for your request`);
  }
  const totalCount = await Notice.countDocuments({
    category: { $regex: `^${category}`, $options: "i" },
  });

  res.status(201).json({
    result: notices,
    hits: notices.length,
    totalHits: totalCount,
  });
};

module.exports = { getByCategory: ctrlWrapper(getByCategory) };
