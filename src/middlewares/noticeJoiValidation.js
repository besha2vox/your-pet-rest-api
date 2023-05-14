const Joi = require("joi");

const { RequestError } = require("../helpers");

const addNoticeJoiSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(16)

    .required()
    .messages({
      "any.required": "Set name for pet",
      "string.min": "Name must have at least 2 characters",
      "string.max": "Name cannot exceed 16 characters",
      "string.pattern.base": "Name must only contain letters",
    }),
  birthday: Joi.string().required(),
  breed: Joi.string()
    .min(2)
    .max(16)

    .required()
    .messages({
      "any.required": "Set type of breed",
      "string.min": "Breed must have at least 2 characters",
      "string.max": "Breed cannot exceed 16 characters",
      "string.pattern.base": "Breed must only contain letters",
    }),
  location: Joi.string().required().messages({
    "any.required": "Set location",
  }),
  price: Joi.number()
    .min(1)
    .when("category", {
      is: Joi.string().valid("sell"),
      then: Joi.required(),
    })
    .messages({
      "number.min": "Price must be higher than 0",
      "any.required": "Set price for sell category",
    }),
  sex: Joi.string().valid("male", "female").required().messages({
    "any.required": "Set sex for notice",
    "any.only": "Invalid sex value",
  }),
  comments: Joi.string().min(8).max(120).allow(null).messages({
    "string.min": "Comments must have at least 8 characters",
    "string.max": "Comments cannot exceed 120 characters",
  }),
  category: Joi.string().valid("sell", "lost-found", "in-good-hands").messages({
    "any.only": "Invalid category value",
  }),
  titleOfAdd: Joi.string().min(8).max(60).messages({
    "string.min": "Title of add must have at least 8 characters",
    "string.max": "Title of add cannot exceed 60 characters",
  }),
  favorite: Joi.array(),
  file: Joi.any().meta({ swaggerType: "file" }).optional().allow(""),
})
  .options({ abortEarly: false })
  .unknown(true);

const updateNoticeJoiSchema = Joi.object({
  name: Joi.string().min(2).max(16).messages({
    "string.min": "Name must have at least 2 characters",
    "string.max": "Name cannot exceed 16 characters",
    "string.pattern.base": "Name must only contain letters",
  }),
  birthday: Joi.string(),
  breed: Joi.string().min(2).max(16).messages({
    "string.min": "Breed must have at least 2 characters",
    "string.max": "Breed cannot exceed 16 characters",
    "string.pattern.base": "Breed must only contain letters",
  }),
  location: Joi.string(),
  price: Joi.number().min(1).messages({
    "number.min": "Price must be higher than 0",
  }),
  sex: Joi.string().valid("male", "female").messages({
    "any.only": "Invalid sex value",
  }),
  comments: Joi.string().min(8).max(120).allow(null).messages({
    "string.min": "Comments must have at least 8 characters",
    "string.max": "Comments cannot exceed 120 characters",
  }),
  category: Joi.string().valid("sell", "lost-found", "in-good-hands").messages({
    "any.only": "Invalid category value",
  }),
  titleOfAdd: Joi.string().min(8).max(60).messages({
    "string.min": "Title of add must have at least 8 characters",
    "string.max": "Title of add cannot exceed 60 characters",
  }),
  favorite: Joi.array(),
  file: Joi.any().meta({ swaggerType: "file" }).optional().allow(""),
})
  .options({ abortEarly: false })
  .unknown(true);

const noticeValidation = (req, _, next) => {
  const { error } = addNoticeJoiSchema.validate(req.body);
  if (error) {
    return next(new RequestError(400, error.message));
  }
  next();
};
const updateNoticeValidation = (req, _, next) => {
  const { error } = updateNoticeJoiSchema.validate(req.body);
  if (error) {
    return next(new RequestError(400, error.message));
  }
  next();
};

module.exports = { noticeValidation, updateNoticeValidation };
