const express = require("express");

// Закоментував тому, що поки змінна ніде не використана - eslint видає помилку
// const { notices: ctrl } = require("../../controllers");

const router = express.Router();

const {
  validation,
  isValidId,
  auth,
  uploadCloud,
} = require("../../middlewares");

const { noticesSchema: schemas } = require("../../models");
const { notices: ctrl } = require("../../controllers");

router.get("/:category", ctrl.getByCategory);
router.get("/:id", ctrl.getNoticeById);
router.post("/:id/favorite", isValidId, auth, ctrl.addToFavorite);
router.get("/favorite", auth, ctrl.getFavoriteNotices);
router.delete("/:id/favorite", auth, ctrl.removeFromFavorite);
router.post(
  "/:category",
  auth,
  validation(schemas.addNoticeJoiSchema),
  uploadCloud.single("image"),
  ctrl.addNotice
);
router.get("/my-notices", auth, ctrl.getUsersNotices);
router.delete("/:contactId", isValidId, auth, ctrl.removeNotice);
router.get("/search/:category", ctrl.searchByTitle);

router.put(
  "/:id",
  isValidId,
  auth,
  validation(schemas.addNoticeJoiSchema),
  ctrl.updateNotice
);

module.exports = router;
