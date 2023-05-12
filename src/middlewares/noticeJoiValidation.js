const Joi = require("joi");
const multer = require("multer");
const upload = multer();
const { RequestError } = require("../helpers");

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
  birthday: Joi.string().required(),
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
  avatarURL: Joi.binary().required(),
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
    .valid("sell", "lost-found", "in-good-hands")
    .required()
    .messages({
      "any.required": "Choose category",
      "any.only": "Invalid category value",
    }),
  titleOfAdd: Joi.string().min(8).max(60).messages({
    "string.min": "Title of add must have at least 8 characters",
    "string.max": "Title of add cannot exceed 60 characters",
  }),
  favorite: Joi.array(),
})
  .options({ abortEarly: false })
  .unknown(true);

// const noticeValidation = async (req, res, next) => {
//   const data = {};
//   console.log(req.body, "BODYY");
//   for (const [key, value] of Object.entries(req.body)) {
//     if (key !== "pets-photo") {
//       data[key] = value;
//     }
//   }
//   console.log(data, "data");
//   req.body = data;
//   const { error } = addNoticeJoiSchema.validate(req.body);
//   if (error) {
//     return next(new RequestError(400, error.message));
//   }
//   next();
// };

// const noticeValidation = async (formData) => {
//   console.log(formData.entries);
//   try {
//     const data = {};
//     for (const [key, value] of formData.entries()) {
//       if (key === "pets-photo") {
//         data[key] = await value.arrayBuffer();
//       } else {
//         data[key] = value;
//       }
//     }
//     const validatedData = await addNoticeJoiSchema.validateAsync(data);
//     validatedData.birthday = moment(validatedData.birthday).toDate();
//     return validatedData;
//   } catch (err) {
//     throw new RequestError(400, `Form data validation failed: ${err.message}`);
//   }
// };
// const noticeValidation = (req, _, next) => {
//   console.log(req.toString, "entries");
//   const { error } = addNoticeJoiSchema.validate(req.body);
//   if (error) {
//     error.status = 400;
//     next(error);
//     return;
//   }
//   next();
// };

const noticeValidation = (req, _, next) => {
  upload.any()(req, _, (err) => {
    if (err) {
      return next(new RequestError(400, err.message));
    }
    next();
  });

  console.log(req.body); // You can access the data sent through form-data here

  const { error } = addNoticeJoiSchema.validate(req.body);
  if (error) {
    error.status = 400;
    next(error);
    return;
  }
  next();
};

module.exports = { noticeValidation };
