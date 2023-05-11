const express = require("express");

const { news: ctrl } = require("../../controllers");

const router = express.Router();

router.get("/", ctrl.getAllNews);

module.exports = router;
