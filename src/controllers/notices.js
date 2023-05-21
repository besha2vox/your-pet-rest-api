const { User, Notice } = require("../db/models");
const { RequestError } = require("../helpers");
const { ctrlWrapper } = require("../middlewares");
  
  
const addNotice = async (req, res) => {
    const { _id: owner } = req.user;
  
    const { category } = req.params;
    if (!req.body) {
      throw new RequestError(400, `there is no body content`);
    }
    const noticeData = req.body;
    if (!req.file) {
      throw new RequestError(400, `no file uploaded`);
    }
  
    const data = req.file
      ? { owner, ...noticeData, category, avatarURL: req.file.path }
      : { owner, ...noticeData, category };
  
    const notice = await Notice.create(data);
    if (!notice) {
      throw new RequestError(400, `error: notice is not created`);
    }
    res.status(201).json({
      result: notice,
    });
  };

  const addToFavorite = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: noticeId } = req.params;
  
    const user = await User.findById(userId);
    if (!user) {
      throw new RequestError(404, `User with id: ${userId} not found`);
    }
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      throw new RequestError(404, `notice with id: ${noticeId} not found`);
    }
  
    const index = notice.favorite.indexOf(userId);
  
    if (index !== -1) {
      return res.json({
        message: `User with id ${userId} already has this notice  in favorite list`,
      });
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { favorite: noticeId } },
      { new: true }
    ).populate(
      "favorite",
      "titleOfAdd avatarURL category name birthday breed location price sex comments"
    );
  
    updatedUser.password = undefined;
  
    await Notice.findByIdAndUpdate(
      noticeId,
      { $push: { favorite: userId } },
      { new: true }
    );
  
    res.json({
      result: {
        updatedUser,
      },
    });
  };

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
  
  const getFavoriteNotices = async (req, res) => {
    const { _id: ownerId } = req.user;
  
    const { page = 1, limit = 12, query = "", gender, age} = req.query;
    const skip = (page - 1) * limit;
  

    const user = await User.findById(ownerId);
    if (!user) {
      throw new RequestError(404, `User with id: ${ownerId} is not found`);
    }
    const favoriteNotices = user.favorite;
  

    const searchWords = query.trim().split(" ");

    const regexExpressions = searchWords.map((word) => ({
      titleOfAdd: { $regex: new RegExp(word, "i") },
    }));

    const searchQuery = {
      $and: [
        { _id: { $in: favoriteNotices } },
        {
          $or: regexExpressions,
        },
      ],
    };

    if (gender || age) {
      const ageQuery = {};
  
      if (gender) {
        ageQuery.sex = gender.toLowerCase();
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

      const notices = await Notice.find(
      searchQuery,
      "-favorite"
    )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "name ");
  
    const totalCount = await Notice.countDocuments(searchQuery);
  
    res.status(200).json({
      result: notices,
      hits: notices.length,
      totalHits: totalCount,
    });
  };

  const getNoticeById = async (req, res) => {
    const { id } = req.params;
    const notice = await Notice.findById(id).populate("owner", "username email phone");
    if (!notice) {
      throw new RequestError(404, `Notice with id: ${id} is not found`);
    }
    res.json({
      result: notice,
    });
  };

  const getUsersNotices = async (req, res) => {
    const { _id: owner } = req.user;
  
    const { page = 1, limit = 12, query = "", age, gender } = req.query;
    const skip = (page - 1) * limit;

    const searchWords = query.trim().split(" ");

    const regexExpressions = searchWords.map((word) => ({
      titleOfAdd: { $regex: new RegExp(word, "i") },
    }));

    const searchQuery = {
      $and: [
        { owner },
        {
          $or: regexExpressions,
        },
      ],
    };
    if (gender || age) {
      const ageQuery = {};
  
      if (gender) {
        ageQuery.sex = gender.toLowerCase();
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
    })
      .sort({ createdAt: -1 })
      .populate("owner", "name email phone");
  
    if (!notices) {
      throw new RequestError(404, `no match for your request`);
    }
    const totalCount = await Notice.countDocuments(searchQuery);
  
    res.status(200).json({
          result: notices,
      hits: notices.length,
      totalHits: totalCount,
    });
  };

  const removeFromFavorite = async (req, res) => {
    const { _id: userId } = req.user;
    const { id: noticeId } = req.params;
  
    const user = await User.findById(userId);
    if (!user) {
      throw new RequestError(404, `User with id: ${userId} not found`);
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favorite: { $eq: noticeId } } },
      { new: true }
    ).populate(
      "favorite",
      "titleOfAdd avatarURL category name birthday breed location price sex comments"
    );
  
    updatedUser.password = undefined;
    await Notice.findByIdAndUpdate(
      noticeId,
      { $pull: { favorite: { $eq: userId } } },
      { new: true }
    );
  
    res.json({
      result: { updatedUser },
    });
  };

  const removeNotice = async (req, res) => {
    const { _id: ownerId } = req.user;
    const { id: noticeId } = req.params;
  
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      throw new RequestError(404, `Notice with id: ${noticeId} is not found`);
    }
  
    if (notice.owner?.toString() !== ownerId?.toString()) {
      throw new RequestError(
        403,
        `User has no access to delete the notice with id  ${noticeId}`
      );
    }
  
    const removedNotice = await Notice.findByIdAndRemove(noticeId);
    if (!removedNotice) {
      throw new RequestError(404, `Notice with id: ${noticeId} is not found`);
    }
  
    res.status(204).json({
      result: removedNotice,
    });
  };

  const searchByTitle = async (req, res) => {
    const { page = 1, limit = 12, query = "", gender, age } = req.query;
    const skip = (page - 1) * limit;
    const { category = "sell" } = req.params;
  
    const searchWords = query.trim().split(" ");
  
    const regexExpressions = searchWords.map((word) => ({
      titleOfAdd: { $regex: new RegExp(word, "i") },
    }));
    const searchQuery = {
      $and: [
        { category },
        {
          $or: regexExpressions,
        },
      ],
    };
  
    if (gender || age) {
      const ageQuery = {};
  
      if (gender) {
        ageQuery.sex = gender.toLowerCase();
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
  
    if (!notices || notices.length === 0) {
      throw new RequestError(404, `no match for your search`);
    }
    const totalHits = await Notice.countDocuments({
      $and: [
        { category },
        {
          $or: regexExpressions,
        },
      ],
    });
  
    res.status(200).json({
      result: notices,
      hits: notices.length,
      totalHits: totalHits,
    });
  };
  

  const updateNotice = async (req, res) => {
    const { _id: ownerId } = req.user;
    const { id: noticeId } = req.params;
  
    if (!req.body) {
      throw new RequestError(422, `there is no body content`);
    }
  
    const notice = await Notice.findById(noticeId);
    if (!notice) {
      throw new RequestError(404, `Notice with id: ${noticeId} is not found`);
    }
  
    if (notice.owner?.toString() !== ownerId?.toString()) {
      throw new RequestError(
        403,
        `User has no access to update the notice with id  ${noticeId}`
      );
    }
  
    const noticeData = await req.body;
  
    const data = req.file
      ? { ...noticeData, avatarURL: req.file.path }
      : { ...noticeData };
  
    const updatedNotice = await Notice.findByIdAndUpdate(noticeId, data, {
      new: true,
    });
  
    if (!updatedNotice) {
      throw new RequestError(400, `Error: notice is not updated`);
    }
  
    res.status(201).json({
      result: updatedNotice,
    });
  };
  
  module.exports = {
    addNotice: ctrlWrapper(addNotice),
    addToFavorite: ctrlWrapper(addToFavorite),
    getByCategory: ctrlWrapper(getByCategory),
    getFavoriteNotices: ctrlWrapper(getFavoriteNotices),
    getNoticeById: ctrlWrapper(getNoticeById),
    getUsersNotices: ctrlWrapper(getUsersNotices),
    removeFromFavorite: ctrlWrapper(removeFromFavorite),
    removeNotice: ctrlWrapper(removeNotice),
    searchByTitle: ctrlWrapper(searchByTitle),
    updateNotice: ctrlWrapper(updateNotice),

  };
  