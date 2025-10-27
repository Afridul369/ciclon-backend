const Joi = require('joi');
const { customError } = require('../utils/customError');
const { mongoose } = require('mongoose');


// Validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};


//  Variant validation schema
const variantValidationSchema = Joi.object({
  product: Joi.string()
    .trim()
    .custom(objectId)
    .required()
    .messages({
      "string.empty": "Product reference cannot be empty.",
      "any.required": "Product reference is required.",
    }),

  variantName: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Variant name cannot be empty.",
      "any.required": "Variant name is required.",
    }),

  variantDescription: Joi.string()
    .trim()
    .allow('', null)
    .messages({
      "string.base": "Variant description must be a string.",
    }),

  size: Joi.string()
    .trim()
    .default('N/A'),
  color: Joi.string(),
  stockVariant: Joi.number()
    .required()
    .min(0)
    .messages({
      "number.base": "Stock quantity must be a number.",
      "any.required": "Stock quantity is required.",
    }),

  alertVariantStock: Joi.number()
    .min(0)
    .default(5)
    .messages({
      "number.base": "Alert variant stock must be a number.",
    }),

  retailPrice: Joi.number()
    .required()
    .min(0)
    .messages({
      "number.base": "Retail price must be a number.",
      "any.required": "Retail price is required.",
    }),

  wholesalePrice: Joi.number()
    .required()
    .min(0)
    .messages({
      "number.base": "Wholesale price must be a number.",
      "any.required": "Wholesale price is required.",
    }),
  isActive: Joi.boolean()
    .default(true)
    .messages({
      "boolean.base": "isActive must be true or false.",
    }),

}, { allowUnknown: true });


// Validation function
exports.validateVariant = async (req) => {
  try {
    const maxFileCount = 5
    // Joi validate
    const value = await variantValidationSchema.validateAsync(req.body);

    //  Image validation
    const acceptImage = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    // if image is missing
    if (!req.files?.image || req.files.image.length === 0) {
      throw new customError(401, "Variant image is required");
    }

    // files length check
     if (req.files.length > maxFileCount) {
      throw new customError(
        400,
        `maximum ${maxFileCount} files should be upload`
      );
    }

    // mime type check
    for (const file of req.files.image) {
      if (!acceptImage.includes(file.mimetype)) {
        throw new customError(401, `This image type (${file.mimetype}) is not allowed`);
      }

      // size check (max 5MB)
      if (req.files.image.size > 5 * 1024 * 1024) {
        throw new customError(401, "Image size must be less than 5MB");
      }
    }

    // if everything is okay return
    return {
      ...value,
      image: req.files.image,
    };

  } catch (error) {
    console.log("Error From Validate Variant:", error);
    const message = error?.details?.[0]?.message || error.message || "Invalid input data";
    throw new customError(401, message);
  }
};
