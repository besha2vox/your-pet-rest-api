const { Pet } = require("../db/models");
const { RequestError } = require("../helpers");
const { ctrlWrapper } = require("../middlewares");

async function addPet(req, res) {
    // const{_id: owner} = req.user;

    if (!req.body) {
    throw new RequestError(400, `The text fields are not filled in`);
    }
    if (!req.file) {
    throw new RequestError(400, `The file is not loaded`);
    }
    
    const result = await Pet.create({
        ...req.body, 
        avatarURL: req.file.path,
        // owner
    });
    res.status(201).json(result);
}

async function deletePetId(req, res) {
    const {id} = req.params;

    const result = await Pet.findByIdAndDelete(id);
    if(!result) {
        console.log(`Pet with id ${id} not found`);
    throw RequestError(404, `Not found`);
    }
    res.status(200).json(
    {
        message: "The pet was deleted",
        result,
    }
    )
}

module.exports = {
    addPet: ctrlWrapper(addPet),
    deletePetId: ctrlWrapper(deletePetId),
};