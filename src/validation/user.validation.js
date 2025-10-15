const Joi = require('joi');
const { customError } = require('../utils/customError');

const userValidationSchema = Joi.object({
    email: Joi.string().trim().pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .messages({
      "string.empty": "Email field cannot be empty.",
      "string.email": "Please enter a valid email address.",
    }),
    password : Joi.string().trim().required().
    pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/).
    messages({
      "string.empty": "Password field cannot be empty.",
      "string.pattern.base":
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
    phoneNumber : Joi.string().trim().pattern(/^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/).messages({
      "string.empty": "Phone number field cannot be empty.",
      "any.required": "Phone number is required.",
      "string.pattern.base": "Please enter a valid Bangladeshi phone number (e.g., +88017XXXXXXXX or 017XXXXXXXX).",
    })
}).unknown(true)

exports.validateUser = async (req)=>{
    try {
        const value = await userValidationSchema.validateAsync(req.body)
        return value
    } catch (error) {
        console.log("Error From Validate User", error);
        throw new customError(401, error.details[0].message)
    }
}