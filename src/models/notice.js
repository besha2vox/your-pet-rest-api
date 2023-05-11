const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleValidationErrors } = require("../errorHandlers");

const noticeSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for pet"],
      minlength: 2,
      maxlength: 16,
      match: /^[a-zA-Z]+$/,
    },
    birthday: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return /^([0-2]\d|3[0-1])\.(0\d|1[0-2])\.\d{4}$/.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid birthdate format (DD.MM.YYYY)`,
      },
    },

    breed: {
      type: String,
      required: [true, "Set type of breed"],
      minlength: 2,
      maxlength: 16,
      match: /^[a-zA-Z]+$/,
    },
    location: {
      type: String,
      required: [true, "Set location"],
    },
    price: {
      type: Number,
      required: function () {
        return this.category === "sell";
      },
      min: [1, "Price must be higher than 0"],
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    comments: {
      type: String,
      minlength: 8,
      maxlength: 120,
      required: [true, "add comment"],
    },
    category: {
      type: String,
      required: [true, "choose category"],
      enum: ["sell", "lost-found", "inGoodHands"],
    },
    titleOfAdd: {
      type: String,
      required: [true, "add title to notice"],
      minlength: 8,
      maxlength: 60,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    avatarURL: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

noticeSchema.post("save", handleValidationErrors);

const addNoticeJoiSchema = Joi.object({
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
  sex: Joi.string()
    .valid("male", "female")
    .when("category", {
      is: Joi.string().valid("sell", "lost/found", "in good hands"),
      then: Joi.required(),
    })
    .messages({
      "any.required": "Set sex for notice",
      "any.only": "Invalid sex value",
    }),
  comments: Joi.string().min(8).max(120).allow(null).messages({
    "string.min": "Comments must have at least 8 characters",
    "string.max": "Comments cannot exceed 120 characters",
  }),
  category: Joi.string()
    .valid("sell", "lost-found", "inGoodHands")
    .required()
    .messages({
      "any.required": "Choose category",
      "any.only": "Invalid category value",
    }),
  titleOfAdd: Joi.string().min(8).max(60).allow(null).messages({
    "string.min": "Title of add must have at least 8 characters",
    "string.max": "Title of add cannot exceed 60 characters",
  }),
}).options({ abortEarly: false });

const Notice = model("notice", noticeSchema);

module.exports = { Notice, addNoticeJoiSchema };
