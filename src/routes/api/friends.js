const express = require("express");

const { friends: ctrl } = require("../../controllers");

const router = express.Router();

router.get("/", ctrl.getAllFriends);

module.exports = router;
