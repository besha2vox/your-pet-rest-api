const express = require("express");

const { news: ctrl } = require("../../controllers");

const router = express.Router();

router.get("/", ctrl.getAllNews);

router.get("/search", ctrl.getNewsByQuery);

module.exports = router;
