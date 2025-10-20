const Joi = require("joi");
const { customError } = require("../utils/customError");

//  Discount validation schema
const discountValidationSchema = Joi.object({
  discountName: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Discount name field cannot be empty.",
      "any.required": "Discount name is required.",
    }),

  discountValidFrom: Joi.date()
    .required()
    .messages({
      "any.required": "Discount valid from date is required.",
      "date.base": "Discount valid from must be a valid date.",
    }),

  discountValidTo: Joi.date()
    .required()
    .messages({
      "any.required": "Discount valid to date is required.",
      "date.base": "Discount valid to must be a valid date.",
    }),

  discountType: Joi.string()
    .valid("taka", "percentance")
    .required()
    .messages({
      "any.only": "Discount type must be either 'taka' or 'percentance'.",
      "any.required": "Discount type is required.",
    }),

  discountPlan: Joi.string()
    .valid("flat", "product", "category" , "subcategory")
    .required()
    .messages({
      "any.only": "Discount plan must be 'flat', 'product', or 'category'.",
      "any.required": "Discount plan is required.",
    }),

  discountValueByAmount: Joi.number()
    .min(0)
    .when("discountType", {
      is: "taka",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "number.base": "Discount amount must be a number.",
      "number.min": "Discount amount must be a positive number.",
      "any.required": "Discount amount is required for taka type.",
    }),

  discountValueByPercentance: Joi.number()
    .min(0)
    .max(100)
    .when("discountType", {
      is: "percentance",
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "number.base": "Discount percentage must be a number.",
      "number.min": "Discount percentage must be positive.",
      "number.max": "Discount percentage cannot exceed 100%.",
      "any.required": "Discount percentage is required for percentance type.",
    }),

  targetProduct: Joi.string().optional().allow(null).messages({
      'any.invalid': 'Target product ID is not valid.',
    }),
  targetCategory: Joi.string().optional().allow(null).messages({
      'any.invalid': 'Target category ID is not valid.',
    }),
  targetSubCategory: Joi.string().optional().allow(null).messages({
      'any.invalid': 'Target subcategory ID is not valid.',
    }),
  isActive: Joi.boolean().default(true),

}, { allowUnknown: true });


//  Validation Function
exports.validateDiscount = async (req) => {
  try {
    const value = await discountValidationSchema.validateAsync(req.body);

    // Optional image validation (only if you allow discount images)
    // if (req.files?.image && req.files.image.length > 0) {
    //   const image = req.files.image[0];
    //   const acceptImage = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

      // Check mimetype
    //   if (!acceptImage.includes(image.mimetype)) {
    //     throw new customError(401, "This image type is not allowed.");
    //   }

      // Check image size (max 5MB)
    //   if (image.size > 5 * 1024 * 1024) {
    //     throw new customError(401, "Image size cannot exceed 5MB.");
    //   }

      // Only one image allowed
    //   if (req.files.image.length > 1) {
    //     throw new customError(401, "Only one image is allowed.");
    //   }

    //   value.image = image;
    // }

    return value;
  } catch (error) {
    console.log("Error From Validate Discount:", error);
    const message = error?.details?.[0]?.message || error.message || "Invalid input data";
    throw new customError(401, message);
  }
};
