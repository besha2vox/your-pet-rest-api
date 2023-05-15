const express = require("express");
const { validation, auth } = require("../../middlewares");
const { schemas, updatePetJoiSchema } = require("../../db/models");
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

// Update User
router.put("/:id", auth, validation(schemas.updateUserSchema), ctrl.updateUser);

// Get info about user and user's pets
router.get("/:id", auth, ctrl.getUserInfo);

// Update info about user and user's pets
router.put("/:id/pets/:id", auth, validation(updatePetJoiSchema), ctrl.updateUserPets);

module.exports = router;
