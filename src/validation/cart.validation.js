const Joi = require("joi");
const { customError } = require("../utils/customError");
const { mongoose } = require("mongoose");

// Validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (value === null || value === "") return value;
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

// Cart Validation Schema
const cartValidationSchema = Joi.object({
  userId: Joi.string().trim().custom(objectId).allow(null, "").messages({
    "any.invalid": "Invalid User ID.",
  }),

  guestId: Joi.string().trim().allow(null, "").messages({
    "string.base": "Guest ID must be a string.",
  }),

  productId: Joi.string().custom(objectId).allow(null, "").messages({
    "string.empty": "Product ID cannot be empty.",
    "any.required": "Product ID is required.",
    "any.invalid": "Invalid Product ID.",
  }),

  variantId: Joi.string().custom(objectId).allow(null, "").messages({
    "any.invalid": "Invalid Variant ID.",
  }),

  color: Joi.string().trim().required().messages({
    "string.empty": "Color is required.",
    "any.required": "Color field cannot be empty.",
  }),

  size: Joi.string().trim().required().messages({
    "string.empty": "Size is required.",
    "any.required": "Size field cannot be empty.",
  }),

  coupon: Joi.string().allow(null, "").messages({
    "any.invalid": "Invalid Coupon ID.",
  }),

  quantity: Joi.number().min(1).required().messages({
    "number.base": "Quantity must be a number.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),
},{
    allowUnknown : true
})



// Validation Function
exports.validateCart = async (req) => {
  try {
    const value = await cartValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("Error From validateCart:", error);
    const message =
      error?.details?.[0]?.message || error.message || "Invalid Cart input data";
    throw new customError(401, message);
  }
};
