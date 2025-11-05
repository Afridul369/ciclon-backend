const Joi = require('joi');
const { customError } = require('../utils/customError');
const {  mongoose } = require('mongoose');

// Validate MongoDB ObjectId
const objectId = (value, helpers) => {
  if(value === null || value === "") return value 
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const productValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Product name cannot be empty.",
    "any.required": "Product name is required.",
  }),
  image: Joi.array().items(Joi.object()).messages({
    "array.base": "Images must be an array of objects.",
  }),
  tag: Joi.array().items(Joi.string().trim()).messages({
    "array.base": "Tags must be an array of strings.",
  }),
  description: Joi.string().trim().allow('').messages({
    "string.base": "Description must be a string.",
  }),
  category: Joi.string().custom(objectId).trim().required().messages({
    "string.empty": "Category is required.",
    "any.required": "Category is required.",
  }),
  subCategory: Joi.string().custom(objectId).allow(null, '').messages({
    "string.base": "Subcategory must be a string.",
  }),
  brand: Joi.string().custom(objectId).trim().allow(null, '').messages({
    "string.base": "Brand must be a string.",
  }),
  variant: Joi.string().custom(objectId).allow(null, '').messages({
    "string.base": "Variant must be a string.",
  }),
  discount: Joi.string().custom(objectId).trim().allow(null, '').messages({
    "string.base": "Discount must be a string.",
  }),
  manufactureCountry: Joi.string().trim().allow(null, '').messages({
    "string.base": "Manufacture country must be a string.",
  }),
  rating: Joi.number().min(0).max(5).messages({
    "number.base": "Rating must be a number between 0 and 5.",
    "number.min": "Rating cannot be less than 0.",
    "number.max": "Rating cannot be more than 5.",
  }),
  warrantyInformation: Joi.string().trim().allow('').messages({
    "string.base": "Warranty information must be a string.",
  }),
  warrantyClaim: Joi.boolean(),
  warrantyExpires: Joi.date().allow(null),
  availabilityStatus: Joi.string().valid('In Stock', 'Out Of Stock', 'PreOrder').messages({
    "any.only": "Availability status must be 'In Stock', 'Out Of Stock', or 'PreOrder'.",
  }),
  shippingInformation: Joi.string().trim().allow('').messages({
    "string.base": "Shipping information must be a string.",
  }),
  Sku: Joi.string().trim().required().messages({
    "string.empty": "SKU cannot be empty.",
    "any.required": "SKU is required.",
  }),
  QrCode: Joi.string().trim().allow(''),
  barCode: Joi.string().trim().allow(''),
  groupUnit: Joi.string().valid('Box', 'Packet', 'Dozen', 'Custom').allow(''),
  groupUnitQuantity: Joi.number().min(0).allow(null),
  unit: Joi.string().valid('Piece', 'Kg', 'Gram', 'Packet', 'Custom').allow(''),
  variantType: Joi.string().valid('single', 'multiple').required().messages({
    "any.required": "Variant type is required.",
    "any.only": "Variant type must be 'single' or 'multiple'.",
  }),
  size: Joi.string().valid('S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom', 'N/A').allow(''),
  color: Joi.string().trim().allow(''),
  stock: Joi.number().min(0).allow(null),
  warehouseLocation: Joi.string().trim().allow(null, ''),
  reviews: Joi.array().items(Joi.string().trim()),
  retailPrice: Joi.number().min(0).optional().messages({
    "any.required": "Retail price is required.",
    "number.min": "Retail price must be at least 0.",
  }),
  retailPriceProfitAmount: Joi.number().min(0).allow(null),
  retailPriceProfitPercentance: Joi.number().min(0).max(100).allow(null),
  wholesalePrice: Joi.number().min(0).allow(null),
  alertQuantity: Joi.number().min(0).allow(null),
  stockAlert: Joi.boolean(),
  inStock: Joi.boolean(),
  inActive: Joi.boolean(),
  minimumOrderQuantity: Joi.number().min(1).allow(null),
}).unknown(true); // allows extra fields

exports.validateProduct = async (req) => {
  try {
    const value = await productValidationSchema.validateAsync(req.body);

    // Validate image files
    const acceptTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!req?.files?.image || req.files.image.length === 0) {
      throw new customError(400, "At least one product image is required.");
    }

    for (const file of req.files.image) {
      if (!acceptTypes.includes(file.mimetype)) {
        throw new customError(
          400,
          `Image type '${file.mimetype}' is not allowed.`
        );
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new customError(400, "Each image must be under 5MB.");
      }
    }

    return {
      ...value,
      image: req.files.image, // returning full image array
    };
  } catch (error) {
    console.log("Error from validateProduct method:", error);
    throw new customError(
      401,
      error.details ? error.details[0].message : error.message
    );
  }
};
