const { Schema, model } = require("mongoose");
const moment = require("moment");
const { handleSchemaValidationError } = require("../../helpers");

const noticeSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for pet"],
      minlength: 2,
      maxlength: 16,
    },
    birthday: {
      type: Date,
      get: (v) => moment(v).format("DD.MM.YYYY"),
      set: (v) => moment(v, "DD.MM.YYYY").toDate(),
      validate: {
        validator: function (value) {
          return moment(value, "DD.MM.YYYY", true).isValid();
        },
        message: "Invalid birth date format (must be dd.mm.yyyy)",
      },
    },

    breed: {
      type: String,
      required: [true, "Set type of breed"],
      minlength: 2,
      maxlength: 16,
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
      validate: [
        {
          validator: function (value) {
            return this.category !== "sell" || value != null;
          },
          message: "Price is required for category 'sell'",
        },
        {
          validator: function (value) {
            return this.category === "sell" || value == null;
          },
          message: "Price is not allowed for categories other than 'sell'",
        },
        {
          validator: function (value) {
            return value == null || value >= 1;
          },
          message: "Price must be higher than 0",
        },
      ],
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    comments: {
      type: String,
      minlength: 2,
      maxlength: 120,
      required: [true, "add comment"],
    },
    category: {
      type: String,
      required: [true, "choose category"],
      enum: ["sell", "lost-found", "in-good-hands"],
    },
    titleOfAdd: {
      type: String,
      required: [true, "add title to notice"],
      minlength: 2,
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
    favorite: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { versionKey: false, timestamps: true }
);

noticeSchema.post("save", handleSchemaValidationError);

const Notice = model("notice", noticeSchema);

module.exports = Notice;
