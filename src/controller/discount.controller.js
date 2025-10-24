const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const {validateDiscount} = require('../validation/discount.validation')
const discountModel = require('../models/discount.model');
const categoryModel = require("../models/category.model");
const subCategoryModel = require("../models/subCategory.model");

// creat discount 
exports.CreateDiscount = asyncHandler(async(req,res)=>{
    // if any field data is null, "null", "" then it will delete that field
    const fieldsToClean = [
        "targetProduct",
        "targetCategory",
        "targetSubCategory"
    ];

    fieldsToClean.forEach(field => {
    if (
      req.body[field] === "null" ||
      req.body[field] === "" ||
      req.body[field] === null
    ) {
      delete req.body[field];
    }
  });
    const data = await validateDiscount(req)
    if(!data) throw new customError(401,"Discount Data Missing")
        const discountData = await discountModel.create({...data})
        if (!discountData) {
            throw new customError(500,"Dscount data Not Created")
        }
        // if discount Plan is product

        // if discount Plan is Category
        if ( discountData.discountPlan == "category" && discountData.targetCategory) {
            await categoryModel.findByIdAndUpdate({ _id : discountData.targetCategory }, { $addToSet:{discount: discountData._id}})
        }
        // if discount Plan is subCategory
        if ( discountData.discountPlan == "subcategory" && discountData.targetSubCategory) {
            await subCategoryModel.findByIdAndUpdate({ _id : discountData.targetSubCategory }, { $addToSet:{discount: discountData._id}})
        }
        apiResponse.sendSucces(res,200,"Discount Created Succesfully", discountData)
})  

// get all discount
exports.GetAllDiscount = asyncHandler(async(req,res)=>{
    const allDiscountData = await discountModel.find()
    // .populate(targetProduct)
    .populate('targetCategory')
    .populate('targetSubCategory')
    .sort({ createdAt: -1 });
    if (!allDiscountData) {
        throw new customError(500,'All Disscount Datta Is Missing')
    }
    apiResponse.sendSucces(res,200,"All Discount data Fetched successfully",allDiscountData)
})

// get single discount
exports.GetSingleDiscount = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"please Insert Your Discount Name")
    }
    const discountData = await discountModel.findOne({slug:slug}).populate('targetCategory').populate('targetSubCategory')
    if (!discountData) {
        throw new customError(500,"This Discount Data Is Missing !!")
    }
    apiResponse.sendSucces(res,200,"Your Discount Data Is fetched... ", discountData)
})

// update discount 
exports.UpdateDiscount = asyncHandler(async(req,res)=>{
     // if any field data is null, "null", "" then it will delete that field
    const fieldsToClean = [
        "targetProduct",
        "targetCategory",
        "targetSubCategory"
    ];

    fieldsToClean.forEach(field => {
    if (
      req.body[field] === "null" ||
      req.body[field] === "" ||
      req.body[field] === null
    ) {
      delete req.body[field];
    }
  });
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"please Insert Your Discount Name")
    }
    const newData = await validateDiscount(req)

    const existingDiscountData = await discountModel.findOne({slug})
    if (!existingDiscountData) {
        throw new customError(404,'No discount Data Found !!' )
    }
    const updatedDiscountData = await discountModel.findOneAndUpdate({slug},newData,{new:true,runValidators:true})
    if (!updatedDiscountData) {
        throw new customError(500,"Failed to Update Discount ")
    }
    //  == category ==
    if (existingDiscountData.discountPlan == 'category' &&
        existingDiscountData.discountPlan?.toString() !== updatedDiscountData.discountPlan.toString()) {
        // remove old data from category
        await categoryModel.findOneAndUpdate(existingDiscountData.targetCategory,{
            discount:null
        })
        // add new data to category
        await categoryModel.findOneAndUpdate(updatedDiscountData.targetCategory,{
            $addToSet:{discount:updatedDiscountData._id}
        })
    }
    // === subCategory ===
    if (existingDiscountData.discountPlan == 'subcategory' &&
        existingDiscountData.discountPlan?.toString() !== updatedDiscountData.discountPlan.toString()) {
        // remove old data from category
        await subCategoryModel.findOneAndUpdate(existingDiscountData.targetSubCategory,{
            discount:null
        })
        // add new data to category
        await subCategoryModel.findOneAndUpdate(updatedDiscountData.targetSubCategory,{
            $addToSet:{discount:updatedDiscountData._id}
        })
    }
    // === product ===
    // if (existingDiscountData.discountPlan == 'product' &&
    //     existingDiscountData.discountPlan?.toString() !== updatedDiscountData.discountPlan.toString()) {
    //     // remove old data from category
    //     await categoryModel.findOneAndUpdate(existingDiscountData.targetCategory,{
    //         discount:null
    //     })
    //     // add new data to category
    //     await categoryModel.findOneAndUpdate(updatedDiscountData.targetCategory,{
    //         $addToSet:{discount:updatedDiscountData._id}
    //     })
    // }
    apiResponse.sendSucces(res,200,'Discount data Updated Successfully')
})

// delete discount 
exports.DeleteDiscount = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"please Insert Your Discount Name")
    }
    const discount = await discountModel.findOne({slug})
    if (!discount) {
        throw new customError(404,'Discount Not Found')
    }
    // if category
    if (discount.discountPlan == 'category') {
        await categoryModel.findOneAndUpdate(discount.targetCategory,
            { $pull: { discount: discount._id } },
            { new: true }
        )
    }
    // if subcategory
    if (discount.discountPlan == 'subcategory') {
        await subCategoryModel.findOneAndUpdate(discount.targetSubCategory,{
             $pull: { discount: discount._id } },
            { new: true })
    }
    // if product 
    // if (discount.discountPlan == 'product') {
    //     await productModel.findOneAndUpdate(discount.targetProduct,
    //      { $pull: { discount: discount._id } },
    //         { new: true })
    // }
    // finally delete the discount 
    await discountModel.findOneAndDelete({_id: discount._id})
    apiResponse.sendSucces(res,200,"Discount Deleted Successfully")
})