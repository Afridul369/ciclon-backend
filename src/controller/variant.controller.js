const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { validateVariant } = require("../validation/variant.validation");
const variantModel = require("../models/variant.model");
const { uploadCloudinaryImage } = require("../helper/cloudinary");
const productModel = require("../models/product.model");

// Create A Variant
exports.CreateVariant = asyncHandler(async(req,res)=>{
    const value = await validateVariant(req)
    // upload image to cloudinary (guard against missing/empty image array)
    let imageUrl = [];
    if (Array.isArray(value.image) && value.image.length) {
        imageUrl = await Promise.all(value.image.map((singleImg)=> uploadCloudinaryImage(singleImg.path)))
    }

    // save to database (create instance then save to avoid double-save issues)
    const variant = new variantModel({...value, image: imageUrl})
    
    const savedVariant = await variant.save()
    if (!savedVariant) {
        throw new customError(500,"Variant Create Failed!!")
    }

    // push the variant id into product model (ensure the product schema field name is correct)
    const updateProduct = await productModel.findOneAndUpdate(
        { _id : value.product},
        { $push : {variant : savedVariant._id} },
        { new : true}
    )

    if (!updateProduct) {
        throw new customError(500,"Product Model Update Failed !!")
    }
    apiResponse.sendSucces(res,201,"Variant Create Successfull",savedVariant)
})

// All Variant
exports.GetAllVariant = asyncHandler(async(req,res)=>{
    const variant = await variantModel.find().populate('product')
    if (!variant) {
        throw new  customError(401,"Product Not Found")
    }
    apiResponse.sendSucces(res,201,"Product Found Successfull" , variant)

})

// Get Variant 
exports.GetSingleVariant = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Slug Missing!!")
    }
    const variant = await variantModel.findOne({slug:slug}).populate('product')
    if (!variant) {
        throw new  customError(401,"Product Not Found")
    }
    apiResponse.sendSucces(res,201,"Product Found Successfull" , variant)

})

// Delete Variant
exports.DeleteVariant = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Slug Missing!!")
    }
    const variant = await variantModel.findOneAndDelete({slug})
    if (!variant) {
        throw new  customError(401,"Product Not Found")
    }
    const updateProduct = await productModel.findOneAndUpdate(
        { _id: variant.product},
        { $pull : {variant : variant._id}},
        { new : true }
    )
    if (!updateProduct) {
        throw new customError(500,"Product Not Updated")
    }
    apiResponse.sendSucces(res,200,'Variant Deleted Successfully',variant)
}) 