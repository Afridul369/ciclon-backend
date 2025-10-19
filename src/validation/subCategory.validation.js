const Joi = require('joi');
const { customError } = require('../utils/customError');

// SubCategory validation schema
const subCategoryValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "SubCategory name field cannot be empty.",
      "any.required": "SubCategory name is required.",
    }),

  category: Joi.string()
    // .custom(isValidObjectId)
    .trim()
    .required()
    .messages({
      "string.empty": "Category ID field cannot be empty.",
      "any.required": "Category ID is required.",
    }),

  isActive: Joi.boolean()
    .optional()
    .default(true)
}, {
  allUnknown: true
});

// Validation function
exports.validateSubCategory = async (req) => {
  try {
    const value = await subCategoryValidationSchema.validateAsync(req.body);
    // return value
    // Return the validated data
    return {
      name: value.name,
      category: value.category,
      isActive: value.isActive !== undefined ? value.isActive : true
    };

  } catch (error) {
    console.log("Error From Validate SubCategory", error);
    const message = error?.details?.[0]?.message || error.message || "Invalid input data";
    throw new customError(401, message);
  }
};
