const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../../utils/validation");

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

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
    favorite: [{ type: Schema.Types.ObjectId, ref: "notice" }],
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
};

const User = model("user", userSchema);

module.exports = { User, schemas };
