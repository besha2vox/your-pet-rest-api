const Joi = require("joi");
const moment = require("moment");

const { RequestError } = require("../helpers");
const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;

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
  birthday: Joi.string()
    .regex(datePattern)
    .custom((value, helpers) => {
      const date = moment(value, "DD.MM.YYYY");
      if (!date.isValid()) {
        return helpers.error("string.dateInvalid");
      }
      return date.toDate();
    })
    .messages({
      "string.pattern.base": "Invalid date format",
      "string.dateInvalid": "Invalid date",
    }),
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
  price: Joi.number().min(1).messages({
    "number.min": "Price must be higher than 0",
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
  birthday: Joi.string()
    .regex(datePattern)
    .custom((value, helpers) => {
      const date = moment(value, "DD.MM.YYYY");
      if (!date.isValid()) {
        return helpers.error("string.dateInvalid");
      }
      return date.toDate();
    })
    .messages({
      "string.pattern.base": "Invalid date format",
      "string.dateInvalid": "Invalid date",
    }),
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
