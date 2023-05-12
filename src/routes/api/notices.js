const express = require("express");

const router = express.Router();

const {
  // isValidId,
  auth,
  uploadCloud,
} = require("../../middlewares");

const { noticeValidation } = require("../../middlewares");
const { notices: ctrl } = require("../../controllers");

router.get("/:category", ctrl.getByCategory);
router.get("/:id", ctrl.getNoticeById);
router.post(
  "/:id/favorite",
  // auth,
  ctrl.addToFavorite
);
router.get("/favorite", auth, ctrl.getFavoriteNotices);
router.delete(
  "/:id/favorite",
  // auth,
  ctrl.removeFromFavorite
);
router.post(
  "/:category",
  // auth,
  // noticeValidation,
  uploadCloud.single("pets-photo"),
  ctrl.addNotice
);
router.get(
  "/",
  // auth,
  ctrl.getUsersNotices
);
router.delete(
  "/:id",
  // auth,
  ctrl.removeNotice
);
router.get("/search/:category", ctrl.searchByTitle);

router.put("/:id", auth, noticeValidation, ctrl.updateNotice);

module.exports = router;
