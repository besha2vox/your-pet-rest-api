const Joi = require("joi");

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const mobileRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

// Create new user schema
const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(8).required(),
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
  birthday: Joi.string()
    .pattern(/^([0-2]\d|3[0-1])\.(0\d|1[0-2])\.\d{4}$/)
    .required()
    .messages({
      "any.required": "Set your birthday",
      "date.base": "Invalid date format",
    }),
  city: Joi.string()
    .pattern(/^[a-zA-Z]+$/)
    .messages({
      "any.required": "Set your city",
    }),
  phone: Joi.string().pattern(mobileRegex).required().messages({
    "any.required": "Set your phone number",
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateUserSchema,
  emailSchema,
};
