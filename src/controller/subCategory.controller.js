const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const subCategoryModel = require("../models/subCategory.model")
const {validateSubCategory} = require('../validation/subCategory.validation')

// create subCategory
exports.CreateSubCategory = asyncHandler(async(req,res)=>{
    const value = await validateSubCategory(req)
    const subCategory = await subCategoryModel.create(value)
    if (!subCategory) {
        throw new customError(500,"subCategory Create Failed !!")
    }
    apiResponse.sendSucces(res,201,"SubCategory Create Successfulll",subCategory)
})

// see all category
exports.getAllCategory = asyncHandler(async(req,res)=>{
    const allSubCategory = await subCategoryModel.find().populate('category').sort({createdAt: -1})
    if (!allSubCategory) {
        throw new customError(500,"AllsubCategory Retrive Failed !!")
    }
    apiResponse.sendSucces(res,201,"SubCategory Retrieved Successfulll",allSubCategory)
})

//get a single subCategory by slug
exports.getsSingleSubCategory = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Please Insert Slug Name")
    }
    const singleSubCategory = await subCategoryModel.find({slug}).populate('category').sort({createdAt: -1})
    if (!singleSubCategory) {
        throw new customError(500,"singleSubCategory Retrive Failed !!")
    }
    apiResponse.sendSucces(res,201,"Single SubCategory Retrieved Successfulll",singleSubCategory)
})

// update subCategory
exports.UpdateSubCategory = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Please Insert Slug Name")
    }
    const subCategory = await subCategoryModel.findOneAndUpdate({slug:slug},{...req.body},{new:true})
    if (!subCategory) {
        throw new customError(500,"subCategory Update Failed !!")
    }
    apiResponse.sendSucces(res,201,"SubCategory Update Successfulll",subCategory)
})

// delete subCategory
exports.DeleteSubCategory = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Please Insert Slug Name")
    }
    const subCategory = await subCategoryModel.findOneAndDelete({slug:slug})
    if (!subCategory) {
        throw new customError(500,"subCategory Delete Failed !!")
    }
    apiResponse.sendSucces(res,201,"SubCategory Delete Successfulll",subCategory)
})