const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { validateCategory } = require("../validation/category.validation");
const categoryModel = require("../models/category.model");
const { uploadCloudinaryImage } = require("../helper/cloudinary");

exports.createCategory = asyncHandler(async (req, res) => {
  const value = await validateCategory(req);
  // console.log(value.image.path);
  const exist = await categoryModel.findOne({ name: value.name });
  if (exist) {
    throw new customError(401, "Category Name Already Exist");
  }

  const imageUrl = await uploadCloudinaryImage(value?.image?.path);
  const category = await new categoryModel({
    name: value.name,
    image: imageUrl,
  }).save();
  if (!category) {
    throw new customError(500, "Category Not Found");
  }
  apiResponse.sendSucces(res, 201, "Category Created", category);
});
