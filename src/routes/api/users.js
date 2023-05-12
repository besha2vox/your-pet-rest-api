const express = require("express");
const { validation, auth } = require("../../middlewares");
const { schemas } = require("../../db/models");
const { users: ctrl } = require("../../controllers");

const router = express.Router();

// Register
router.post("/register", validation(schemas.registerSchema), ctrl.register);

// Log in
router.post("/login", validation(schemas.loginSchema), ctrl.login);

// Get current User
router.get("/current", auth, ctrl.getCurrent);

// Log out
router.post("/logout", auth, ctrl.logout);

module.exports = router;
