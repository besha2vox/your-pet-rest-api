const { Schema, model } = require("mongoose");
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
    tokens: {
      accessToken: {
        type: String,
        default: "",
      },
      refreshToken: {
        type: String,
        default: "",
      },
    },

    birthday: {
      type: String,
    },
    phone: {
      type: String,
    },
    city: {
      type: String,
      match: /^[a-zA-Z]+$/,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
    avatarURL: {
      type: String,
      default: null,
    },
    firstVisit: {
      type: Boolean,
      default: true,
    },
    pet: {
      type: Schema.Types.ObjectId,
      ref: "pet",
    },
    favorite: [
      {
        type: Schema.Types.ObjectId,
        ref: "notice",
      },
    ],
  },
  {
    versionKey: false,
  }
);

userSchema.post("save", handleMongooseError);

const User = model("user", userSchema);

module.exports = { User };
