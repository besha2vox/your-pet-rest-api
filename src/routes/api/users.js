const express = require('express');
const { validation, auth, uploadCloud } = require('../../middlewares');
const {
    registerSchema,
    loginSchema,
    refreshSchema,
    updateUserSchema,
    updateStatusSchema,
} = require('../../middlewares');
const { updatePetJoiSchema } = require('../../db/models');
const { users: ctrl } = require('../../controllers');

const router = express.Router();

// Register
router.post('/register', validation(registerSchema), ctrl.register);

// Log in
router.post('/login', validation(loginSchema), ctrl.login);

// Refresh
router.post('/refresh', validation(refreshSchema), ctrl.refresh);

// Get current User
router.get('/current', auth, ctrl.getCurrent);

// Log out
router.post('/logout', auth, ctrl.logout);

// Verification
router.get('/verify/:verificationToken', ctrl.verify);

// Update User
router.put(
    '/:id',
    auth,
    uploadCloud.single('pets-photo'),
    validation(updateUserSchema),
    ctrl.updateUser,
    ctrl.getUserInfo
);

// Get info about user and user's pets
router.get('/:id', auth, ctrl.getUserInfo);

// Update and user's pets
router.put(
    '/pets/:id',
    auth,
    validation(updatePetJoiSchema),
    ctrl.updateUserPets
);

router.patch(
    '/status',
    auth,
    validation(updateStatusSchema),
    ctrl.updateStatus,
    ctrl.getUserInfo
);

module.exports = router;
