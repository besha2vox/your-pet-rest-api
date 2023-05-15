const { Schema, model } = require("mongoose");

const { handleSchemaValidationError } = require("../../helpers");

const catSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for cat"],
      minlength: 2,
      maxlength: 40,
    },

    gitURL: {
      type: String,
      required: true,
    },
    telegramURL: {
      type: String,
    },
    linkedInURL: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
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

catSchema.post("save", handleSchemaValidationError);

const Cat = model("cat", catSchema);

module.exports = Cat;
