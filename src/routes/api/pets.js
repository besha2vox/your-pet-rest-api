const express = require("express");
const router = express.Router();

const { pets: ctrl } = require("../../controllers");
const { validation, isValidId, auth, uploadCloud } = require("../../middlewares");
const { addPetJoiSchema }  = require("../../db/models/pets"); 


router.post("/", auth, uploadCloud.single("pets-photo"), validation(addPetJoiSchema), ctrl.addPet);
router.delete("/:id", auth, isValidId, ctrl.deletePetId);

module.exports = router;
