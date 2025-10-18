const Joi = require('joi');
const { customError } = require('../utils/customError');

// Category validation schema
const categoryValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty": "Category name field cannot be empty.",
      "any.required": "Category name is required.",
    }),

},{
    allUnknown : true
})

// Validation function
exports.validateCategory = async (req) => {
  try {
    const value = await categoryValidationSchema.validateAsync(req.body);
  // check mimetype
    const acceptImage = [ "image/png","image/jpeg","image/jpg","image/webp" ]
    if (!acceptImage.includes(req.files.image[0].mimetype)) {
      throw new customError(401,"This Image Is Not Allowed")
    }
    // check image size
    if (req.files.image[0].size > 5*1024*1024) {
      throw new customError(401,'This is Is Not Allowed Image Size Maximum 5MB')
    }
    // check image quantity
    if (req.files.image?.length > 1) {
      throw new customError(401,"Allowed Image Quantity Maximum 1")
    }

    return {name:value.name, image:req.files.image[0] }

  } catch (error) {
    console.log("Error From Validate Category", error);
    const message = error?.details?.[0]?.message || error.message || "Invalid input data";
    throw new customError(401, message);
  }
};
