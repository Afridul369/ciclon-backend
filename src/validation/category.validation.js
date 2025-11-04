const Joi = require("joi");
const { customError } = require("../utils/customError");

// Category validation schema
const categoryValidationSchema = Joi.object(
  {
    name: Joi.string().trim().required().messages({
      "string.empty": "Category name field cannot be empty.",
      "any.required": "Category name is required.",
    }),
  },
  {
    allUnknown: true,
  }
);

// Validation function
exports.validateCategory = async (req) => {
  try {
    const value = await categoryValidationSchema.validateAsync(req.body);

    if (!req?.files?.image || !req?.files?.image[0]) {
      throw new customError("Please upload at least one image.", 401);
    }

    const imageFile = req.files.image[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(imageFile.mimetype)) {
      throw new customError("This image type is not allowed.", 401);
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      throw new customError("Image size must not exceed 5MB.", 401);
    }

    if (req.files.image.length > 1) {
      throw new customError("Only 1 image is allowed.", 401);
    }

    return { name: value.name, image: imageFile };
  } catch (error) {
    console.log("Error From Validate Category:", error);

    let message = "Invalid input data";
    if (error?.details && Array.isArray(error.details) && error.details[0]?.message) {
      message = error.details[0].message;
    } else if (error?.message) {
      message = error.message;
    }

    throw new customError(401,message );
  }
};
