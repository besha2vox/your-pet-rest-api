const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleValidationErrors } = require("../errorHandlers");

const petSchema = Schema(
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
      required: true,
      minlength: 2,
      maxlength: 16,
      match: /^[a-zA-Z]+$/,
    },
    comments: {
      type: String,
      minlength: 8,
      maxlength: 120,
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

petSchema.post("save", handleValidationErrors);

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

const Pet = model("pet", petSchema);

module.exports = { Pet, addPetJoiSchema };
