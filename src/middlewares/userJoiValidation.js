const Joi = require("joi");
const moment = require("moment");
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const mobileRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;

// Create new user schema
const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().min(8).required(),
});
// Log in with a user
const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(8).required(),
});
// Refresh token schema
const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
// Update user schema
const updateUserSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().pattern(emailRegex),
  birthday: Joi.string()
    .regex(dateRegex)
    .custom((value, helpers) => {
      const date = moment(value, "DD.MM.YYYY");
      if (!date.isValid()) {
        return helpers.error("string.dateInvalid");
      }
      return date.toDate();
    })
    .messages({
      "any.required": "Set your birthday",
      "date.base": "Invalid date format",
    }),
  city: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      "any.required": "Set your city",
    }),
  phone: Joi.string().pattern(mobileRegex).messages({
    "any.required": "Set your phone number",
  }),

  avatarURL: Joi.string(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

const updateStatusSchema = Joi.object({
  firstVisit: Joi.boolean().required(),
}).unknown(false);

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateUserSchema,
  emailSchema,
  updateStatusSchema,
};
