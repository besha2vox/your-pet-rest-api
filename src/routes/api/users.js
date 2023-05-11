const express = require("express");
const { validation } = require("../../middlewares");
const { schemas } = require("../../db/models");
const { users: ctrl } = require("../../controllers");

const router = express.Router();

// Register
router.post("/register", validation(schemas.registerSchema), ctrl.register);

// Log in
router.post("/login", validation(schemas.loginSchema), ctrl.login);

// Get current User

// Log out

module.exports = router;
