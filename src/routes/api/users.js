const express = require("express");
const { validation } = require("../../middlewares");
const { schemas } = require("../../db/models");
const { users: ctrl } = require("../../controllers");

const router = express.Router();

// Register
router.post("/register", validation(schemas.registerSchema), ctrl.register);

// Log in

// Get current User

// Log out

// Update User data

module.exports = router;
