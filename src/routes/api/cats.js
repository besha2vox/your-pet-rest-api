const express = require("express");
const router = express.Router();

const { cats: ctrl } = require("../../controllers");
const { auth, uploadCloud } = require("../../middlewares");

router.get("/", ctrl.getAllCats);

router.post("/", auth, uploadCloud.single("pets-photo"), ctrl.addCat);
router.delete("/:id", auth, ctrl.deleteCatById);

module.exports = router;
