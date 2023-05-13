const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleSchemaValidationError } = require("../../helpers");

const stringPattern = /^[a-zA-Zа-яА-Я\s]+$/;
const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;

const petSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for pet"],
      minlength: 2,
      maxlength: 16,
      match: stringPattern,
    },
    birthday: {
      type: Date,
      required: [true, "Set date of birth"],
      match: [datePattern, "Invalid birthdate format (must be dd.mm.yyyy)"],
    },
    category: {
      type: String,
      enum: ["sell", "lost-found", "inGoodHands", "your pet"],
      required: [true, "Choose one of the categories"],
    },
    breed: {
      type: String,
      required: [true, "Set the breed"],
      minlength: 2,
      maxlength: 16,
      match: stringPattern,
    },
    comments: {
      type: String,
      minlength: 8,
      maxlength: 120,
      default: null,
    },
    // owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: "user",
    //   required: true,
    // },
    avatarURL: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

petSchema.post("save", handleSchemaValidationError);

const addPetJoiSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(16)
    .pattern(stringPattern)
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
  category: Joi.string().valid('sell', 'lost-found', 'inGoodHands', 'your pet').required().messages({
    'any.required': 'Choose one of the categories',
    'any.only': 'Choose one of the categories',
  }),
  breed: Joi.string()
    .min(2)
    .max(16)
    .pattern(stringPattern)
    .required()
    .messages({
      "any.required": "Set type of breed",
      "string.min": "Breed must have at least 2 characters",
      "string.max": "Breed cannot exceed 16 characters",
      "string.pattern.base": "Breed must only contain letters",
    }),
  comments: Joi.string().min(8).max(120).allow("").messages({
    "string.min": "Comments must have at least 8 characters",
    "string.max": "Comments cannot exceed 120 characters",
  }),
  avatar: Joi.string().optional(),
}).options({ abortEarly: false });

const Pet = model("pet", petSchema);

module.exports = {
    Pet,
    addPetJoiSchema
}
