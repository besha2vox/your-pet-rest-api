const express = require("express");
const router = express.Router();

const {
  auth,
  uploadCloud,
  noticeValidation,
  updateNoticeValidation,
} = require("../../middlewares");

const { notices: ctrl } = require("../../controllers");

router.get("/", auth, ctrl.getUsersNotices);
router.get("/favorites", auth, ctrl.getFavoriteNotices);

router.post("/favorite/:id", auth, ctrl.addToFavorite);
router.delete("/favorite/:id", auth, ctrl.removeFromFavorite);

router.get("/:category", ctrl.getByCategory);
router.post(
  "/:category",
  auth,
  uploadCloud.single("pets-photo"),
  noticeValidation,
  ctrl.addNotice
);

router.get("/search/:category", ctrl.searchByTitle);

router.get("/notice/:id", ctrl.getNoticeById);
router.delete("/notice/:id", auth, ctrl.removeNotice);
router.put(
  "/notice/:id",
  auth,
  uploadCloud.single("pets-photo"),
  updateNoticeValidation,
  ctrl.updateNotice
);

module.exports = router;
