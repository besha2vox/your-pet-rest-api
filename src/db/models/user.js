const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../../utils/validation");

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegex,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
    },
    token: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
    },
    city: {
      type: String,
      match: /^[a-zA-Z]+$/,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    avatarURL: {
      type: String,
    },
    firstVisit: {
      type: Boolean,
      default: true,
    },
    favorite: {
      type: [],
    },
    pets: {
      type: Schema.Types.ObjectId,
      ref: "pet",
    },
  },
  {
    versionKey: false,
  }
);

userSchema.post("save", handleMongooseError);

const schemas = {
  // Create new user schema
  registerSchema: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(8).required(),
  }),
  // Log in with a user
  loginSchema: Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(8).required(),
  }),
  // Update user schema
  updateUserSchema: Joi.object({
    birthday: Joi.date().required().messages({
      "any.required": "Set your birthday",
      "date.base": "Invalid date format",
    }),
    city: Joi.string()
      .pattern(/^[a-zA-Z]+$/)
      .messages({
        "any.required": "Set your city",
      }),
    mobilePhone: Joi.string().pattern(mobileRegex).required().messages({
      "any.required": "Set your mobile phone number",
    }),
  }),

  emailSchema: Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
  }),
};

const User = model("user", userSchema);

module.exports = { User, schemas };
