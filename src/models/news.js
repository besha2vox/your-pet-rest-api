const { Schema, model } = require("mongoose");
const { handleSchemaValidationError } = require("../src/helpers");

const newsSchema = new Schema(
  {
    imgUrl: {
      type: String,
    },
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    date: {
      type: String,
    },
    url: {
      type: String,
    },
    id: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

newsSchema.post("save", handleSchemaValidationError);

const News = model("news", newsSchema);

module.exports = {
  News,
};
