const Joi = require('joi');
const { customError } = require('../utils/customError');

// Brand validation schema
const brandValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Brand name field cannot be empty.",
      "any.required": "Brand name is required.",
    }),

  since: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Brand founding year must be a number.",
      "number.min": "Brand founding year cannot be before 1800.",
      "number.max": "Brand founding year cannot be in the future.",
      "any.required": "Brand founding year (since) is required.",
    }),

}, {
  allUnknown: true
});

// Validation function
exports.validateBrand = async (req) => {
  try {
    const value = await brandValidationSchema.validateAsync(req.body);

    //  Check image part
    const acceptImage = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!req.files || !req.files.image || !req.files.image[0]) {
      throw new customError(401, "Brand image is required.");
    }

    //  Check MIME type
    if (!acceptImage.includes(req.files.image[0].mimetype)) {
      throw new customError(401, "This image type is not allowed.");
    }

    //  Check image size (max 5MB)
    if (req.files.image[0].size > 5 * 1024 * 1024) {
      throw new customError(401, "Image size cannot exceed 5MB.");
    }

    //  Check image count
    if (req.files.image.length > 1) {
      throw new customError(401, "Only one brand image is allowed.");
    }

    //  Return validated data
    return {
      name: value.name,
      since: value.since,
      image: req.files.image[0],
    };

  } catch (error) {
    console.log("Error From Validate Brand", error);
    const message = error?.details?.[0]?.message || error.message || "Invalid input data";
    throw new customError(401, message);
  }
};
