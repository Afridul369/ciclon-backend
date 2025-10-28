const Joi = require("joi");
const { customError } = require("../utils/customError");

const couponValidationSchema = Joi.object(
  {
    code: Joi.string()
      .trim()
      .required()
      .messages({
        "string.empty": "Coupon code field cannot be empty.",
        "any.required": "Coupon code is required.",
      }),

    expireAt: Joi.date()
      .greater("now")
      .required()
      .messages({
        "date.base": "Expire date must be a valid date.",
        "date.greater": "Expire date must be in the future.",
        "any.required": "Coupon expiry date is required.",
      }),

    usageLimit: Joi.number()
      .integer()
      .min(1)
      .default(50)
      .messages({
        "number.base": "Usage limit must be a number.",
        "number.min": "Usage limit must be at least 1.",
      }),

    usedCount: Joi.number()
      .integer()
      .min(0)
      .default(50)
      .messages({
        "number.base": "Used count must be a number.",
        "number.min": "Used count cannot be negative.",
      }),

    discountType: Joi.string()
      .valid("percentance", "tk")
      .required()
      .messages({
        "any.only": "Discount type must be either 'percentance' or 'tk'.",
        "any.required": "Discount type is required.",
      }),

    discountValue: Joi.number()
      .positive()
      .required()
      .min(0)
      .messages({
        "number.base": "Discount value must be a number.",
        "number.positive": "Discount value must be positive.",
        "any.required": "Discount value is required.",
      }),

  },
  { allowUnknown: true }
);

//  Validation function
exports.validateCoupon = async (req) => {
  try {
    const value = await couponValidationSchema.validateAsync(req.body);

    return {
      code: value.code,
      expireAt: value.expireAt,
      usageLimit: value.usageLimit ?? 50,
      discountType: value.discountType,
      discountValue: value.discountValue,
    };
  } catch (error) {
    console.log("Error From Validate Coupon:", error);
    const message =
      error?.details?.[0]?.message || error.message || "Invalid input data";
    throw new customError(401, message);
  }
};
