const express = require("express");
const router = express.Router();

const {
  // isValidId,
  auth,
  uploadCloud,
} = require("../../middlewares");

// const { noticeValidation } = require("../../middlewares");
const { notices: ctrl } = require("../../controllers");
router.get("/", auth, ctrl.getUsersNotices);
router.get("/favorites", auth, ctrl.getFavoriteNotices);
router.post("/favorite/:id", auth, ctrl.addToFavorite);
router.delete("/favorite/:id", auth, ctrl.removeFromFavorite);
router.get("/:category", ctrl.getByCategory);
router.get("/notice/:id", ctrl.getNoticeById);

router.post(
  "/:category",
  auth,
  uploadCloud.single("pets-photo"),
  // noticeValidation,
  ctrl.addNotice
);
router.delete("/notice/:id", auth, ctrl.removeNotice);
router.get("/search/:category", ctrl.searchByTitle);

router.put(
  "/notice/:id",
  auth,
  // noticeValidation,
  uploadCloud.single("pets-photo"),
  ctrl.updateNotice
);

module.exports = router;
