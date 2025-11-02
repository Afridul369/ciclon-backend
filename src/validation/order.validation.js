const Joi = require("joi");
const { customError } = require("../utils/customError");
const mongoose = require("mongoose");

// Validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (value === null || value === "") return value;
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const orderValidationSchema = Joi.object({
  user: Joi.string().allow("", null).optional().trim(),
  guestId: Joi.string().allow("", null).optional(),

  shippinginfo: Joi.object({
    firstname: Joi.string().trim().messages({
      "string.empty": "First name is required in shipping info.",
      "any.required": "First name is required in shipping info.",
    }),
    phone: Joi.string()
      .trim()
      .pattern(/^(?:\+88|88)?(01[3-9]\d{8})$/)
      .required()
      .messages({
        "string.empty": "Phone number is required.",
        "any.required": "Phone number is required.",
        "string.pattern.base": "Please enter a valid Bangladeshi phone number.",
      }),
    address: Joi.string().trim().required().messages({
      "string.empty": "Address is required.",
      "any.required": "Address is required.",
    }), 
    email: Joi.string().email().allow(null, "").messages({
      "string.email": "Email must be a valid email address.",
    }),
    country: Joi.string().trim().default("Bangladesh"),
    deliveryZone: Joi.string()
      .valid("inside_dhaka", "outside_dhaka", "sub_area")
      .messages({
        "any.only":
          "Delivery zone must be one of 'inside_dhaka', 'outside_dhaka', or 'sub_area'.",
        "any.required": "Delivery zone is required.",
      }),
  }).required(),

  deliveryCharge: Joi.string().custom(objectId).required().messages({
    "any.invalid": "Invalid delivery charge ID.",
    "any.required": "Delivery charge is required.",
  }),

}).unknown(true); // allows extra optional fields

// Validation function
exports.validateOrder = async (req) => {
  try {
    const value = await orderValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("Error from validateOrder method:", error);
    throw new customError(
      401,
      error.details ? error.details[0].message : error.message
    );
  }
};
