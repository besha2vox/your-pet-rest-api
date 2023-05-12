const { Schema, model } = require("mongoose");
// const moment = require("moment");
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
      type: String,
      required: true,
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
      enum: ["sell", "lost-found", "in-good-hands"],
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
    favorite: [{ type: Schema.Types.ObjectId, ref: "user" }],
  },
  { versionKey: false, timestamps: true }
);

// noticeSchema.pre("save", function (next) {
//   if (this.birthday) {
//     console.log(this.birthday, "this.birthday");
//     this.birthday = moment(this.birthday).toDate();
//   }
//   next();
// });

noticeSchema.post("save", handleSchemaValidationError);

const Notice = model("notice", noticeSchema);

module.exports = Notice;
