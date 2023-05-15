const { Schema, model } = require("mongoose");

const { handleSchemaValidationError } = require("../../helpers");
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

petSchema.post("save", handleSchemaValidationError);

const Pet = model("pet", petSchema);

module.exports = Pet;
