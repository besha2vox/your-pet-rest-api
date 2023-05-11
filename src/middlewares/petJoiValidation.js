const Joi = require("joi");
const { RequestError } = require("../helpers");

const addPetJoiSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(16)
    .pattern(/^[a-zA-Z]+$/)
    .required()
    .messages({
      "any.required": "Set name for pet",
      "string.min": "Name must have at least 2 characters",
      "string.max": "Name cannot exceed 16 characters",
      "string.pattern.base": "Name must only contain letters",
    }),
  birthday: Joi.date().required().messages({
    "any.required": "Set birthday for pet",
    "date.base": "Invalid date format",
  }),
  breed: Joi.string()
    .min(2)
    .max(16)
    .pattern(/^[a-zA-Z]+$/)
    .required()
    .messages({
      "any.required": "Set type of breed",
      "string.min": "Breed must have at least 2 characters",
      "string.max": "Breed cannot exceed 16 characters",
      "string.pattern.base": "Breed must only contain letters",
    }),
  comments: Joi.string().min(8).max(120).allow(null).messages({
    "string.min": "Comments must have at least 8 characters",
    "string.max": "Comments cannot exceed 120 characters",
  }),
}).options({ abortEarly: false });

const petValidation = (req, res, next) => {
  const { error } = addPetJoiSchema.validate(req.body);
  if (error) {
    return next(new RequestError(400, error.message));
  }
  next();
};

module.exports = petValidation;
