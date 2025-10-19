const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const {validateDiscount} = require('../validation/discount.validation')
const discountModel = require('../models/discount.model')