const { Schema, model } = require("mongoose");
const { handleSchemaValidationError } = require("../../helpers");

const friendsSchema = new Schema(
  {
    title: {
      type: String,
    },
    url: {
      type: String,
    },
    addressUrl: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    address: {
      type: String,
    },
    workDays: {
      type: [Schema.Types.Mixed],
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

friendsSchema.post("save", handleSchemaValidationError);

const Friends = model("friends", friendsSchema);

module.exports = {
  Friends,
};
