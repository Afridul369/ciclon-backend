const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const {validateBrand} = require('../validation/brand.validation')
const brandModel = require('../models/brand.model');
const { uploadCloudinaryImage, deleteCloudinaryImage } = require("../helper/cloudinary");

// create brand
exports.CreateBrand = asyncHandler(async(req,res)=>{
    const value = await validateBrand(req)
    // console.log(value.image.path);
    const imageUrl = await uploadCloudinaryImage(value?.image?.path)
    if (!imageUrl) {
        throw new customError(500, 'Image Not Created !!')
    }
    const brand = await brandModel.create(
        {
        ...value,
        image: imageUrl
        }
    )
    if (!brand) {
        throw new customError(500,'Brand Not Created !!')
    }
    apiResponse.sendSucces(res,201,'Brand Created Successfully', brand)
})

// get all brand
exports.GetAllBrand = asyncHandler(async(req,res)=>{
    const allBrand = await brandModel.find()
    if (!allBrand) {
        throw new customError(500, 'Brand Not Found')
    }
    apiResponse.sendSucces(res,201,'brand Retrive Successfull', allBrand)
})

// get single brand
exports.GetSingleBrand = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) throw new customError(401, 'Please Insert Your Brand Name')
    const brand = await brandModel.findOne({slug: slug})
    if (!brand) throw new customError(500, 'Brand Not Found')
    apiResponse.sendSucces(res,201,"Your Single Brand Retrive Successfull",brand)
})

// delete brand
exports.DeleteBrand = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {throw new customError(401, 'Please Insert Your Brand Name')
    }
// delete from database
    const brand = await brandModel.findOneAndDelete({slug})
    if (!brand) { throw new customError(500, 'Brand Not Found')
    }
// delete from cloudinary
    const parts = brand.image.split('/')
    const imageaPart = parts[parts.length - 1]
    const imageId = imageaPart.split('?')[0]
    const result = await deleteCloudinaryImage(imageId)
     if (result !== "ok" ) throw new customError(400,"Image Not Deleted")
    apiResponse.sendSucces(res,201,"Brand Delete Successfull",brand)    
})

