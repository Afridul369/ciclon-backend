const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { validateCategory } = require("../validation/category.validation");
const categoryModel = require("../models/category.model");
const { uploadCloudinaryImage, deleteCloudinaryImage } = require("../helper/cloudinary");

// create category
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
  })
  if (!category) {
    throw new customError(500, "Category Not Found");
  }
  await category.save()
  apiResponse.sendSucces(res, 201, "Category Created", category);
});

exports.get_all_category = asyncHandler(async(req,res)=>{
    const allCategory = await categoryModel.find().sort( {createdAt : -1})
    if (!allCategory) {
        throw new customError(500,"Category Not Found")
    }
    apiResponse.sendSucces(res,201,"Category Found",allCategory)
})

// fine all category
exports.categoryBySlug = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    const category = await categoryModel.findOne({slug})
    if (!category) {
        throw new customError(401,"Category Not Found")
    }
    apiResponse.sendSucces(res,201,"Category Found" ,category)
})

// update category
exports.updateSingleCategory = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    // return console.log("Request Body:", slug);

    if (!slug) {
        throw new customError(401,"Please Insert Your category Name")
    }
    const category = await categoryModel.findOne({slug})
    if (!category) {
        throw new customError(401,"Your Category Is Missing")
    }
    if (req.body.name) {
        category.name = req?.body?.name
    }
    if (req.files.image) {
        // delete from cloudinary
        const Parts = category.image.split('/') //devide the full url into parts by /
        const imageParts = Parts[Parts.length-1] // catching the last element
        const imageId = imageParts.split('?')[0] // devide the last element by ? and select the 1st element
        const result = await deleteCloudinaryImage(imageId)
        if (result !== "ok" ) throw new customError(400,"Image Not Deleted")
        // upload new image to cloudinary
        const imageUrl = await uploadCloudinaryImage(req?.files?.image[0].path)
        category.image = imageUrl
    }

    await category.save()
    apiResponse.sendSucces(res,201,"Category Updated Done",category)
})

// delete category
exports.deleteCategory = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    const category = await categoryModel.findOne({slug:slug})
    // console.log(category);
    if (!category) {
        throw new customError(401,"Category Name Missing")
    }
    // return console.log(category);
    // delete from cloudinary
    const Parts = category.image.split('/') //devide the full url into parts by /
    const imageParts = Parts[Parts.length-1] // catching the last element
    const imageId = imageParts.split('?')[0] // devide the last element by ? and select the 1st element
    const result = await deleteCloudinaryImage(imageId)
        if (result !== "ok" ) throw new customError(400,"Image Not Deleted")
    // delete from db
    const deleteCategoryfromdb = await categoryModel.findOneAndDelete({slug})

    apiResponse.sendSucces(res,201,"Category Deleted Successfully", deleteCategoryfromdb)
})