const { Notice } = require("../db/models");
const { RequestError } = require("../helpers");

const filterByQueries = async (req, _, next) => {
  const { gender, age } = req.query;

  if (!gender && !age) {
    return next();
  }

  const searchQuery = {};

  if (gender) {
    searchQuery.sex = gender.toLowerCase();
  }
  if (age) {
    const today = new Date();
    //    const minBirthYear = today.getFullYear() - parseInt(age);
    const maxBirthYear = today.getFullYear() - parseInt(age) + 1;

    if (age === "1y") {
      searchQuery.birthday = {
        $gte: new Date(maxBirthYear - 1, today.getMonth(), today.getDate()),
        $lt: new Date(maxBirthYear, today.getMonth(), today.getDate()),
      };
    } else if (age === "2y") {
      searchQuery.birthday = {
        $lt: new Date(maxBirthYear - 2, today.getMonth(), today.getDate()),
      };
    } else if (age === "3m-12m") {
      searchQuery.birthday = {
        $gte: new Date(maxBirthYear - 1, today.getMonth() - 3, today.getDate()),
        $lt: new Date(maxBirthYear, today.getMonth(), today.getDate()),
      };
    } else {
      throw new RequestError(404, `wrong age parameter`);
    }
  }

  const notices = await Notice.find(searchQuery);

  if (!notices || notices.length === 0) {
    throw new RequestError(404, `no match for your search`);
  }
  return notices;
};

module.exports = {
  filterByQueries,
};
