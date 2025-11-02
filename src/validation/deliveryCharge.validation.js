const Joi = require('joi');
const { customError } = require('../utils/customError');

// DeliveryCharge validation schema
const deliveryChargeValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Delivery charge name field cannot be empty.",
      "any.required": "Delivery charge name is required.",
    }),

  amount: Joi.number()
    .required()
    .min(0)
    .messages({
      "number.base": "Amount must be a valid number.",
      "number.min": "Amount must be a positive number.",
      "any.required": "Amount is required.",
    }),

  isActive: Joi.boolean()
    .optional()
    .default(true),
}, {
  allUnknown: true
});

// Validation function
exports.validateDeliveryCharge = async (req) => {
  try {
    const value = await deliveryChargeValidationSchema.validateAsync(req.body);

    // Return the validated data
    return {
      name: value.name,
      amount: value.amount,
      isActive: value.isActive !== undefined ? value.isActive : true
    };

  } catch (error) {
    console.log("Error From Validate DeliveryCharge", error);
    const message = error?.details?.[0]?.message || error.message || "Invalid input data";
    throw new customError(401, message);
  }
};
