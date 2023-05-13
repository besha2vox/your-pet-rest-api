const express = require("express");
const { validation, auth, uploadUserAvatar } = require("../../middlewares");
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

// Verification
router.get("/verify/:verificationToken", ctrl.verify);

// Resend verification
router.post("/verify", validation(schemas.emailSchema), ctrl.resendVerifyEmail);

// Update User
router.patch("/users", auth, validation(schemas.updateUserSchema), ctrl.updateUser);

// Update avatar
router.patch("/avatars", auth, uploadUserAvatar.single("avatar"), ctrl.updateAvatar);

module.exports = router;
