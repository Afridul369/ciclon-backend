const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { validateCoupon } = require("../validation/coupon.validation");
const couponModel = require('../models/coupon.model')

// Create Coupon
exports.CreateCoupon = asyncHandler(async(req,res)=>{
    const value = await validateCoupon(req)
    const coupon = await couponModel.create({...value})
    if (!coupon) {
        throw new customError(500,"Coupon Not Created")
    }
    await coupon.save()
    apiResponse.sendSucces(res,200,"Coupon Created Successfully",coupon)
})

// Get Single Coupon
exports.getSingleCoupon = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Slug Missing !!")
    }
    const coupon = await couponModel.findOne({slug:slug})
    if (!coupon) {
        throw new customError(401,"Coupon Not Found !!")
    }
    apiResponse.sendSucces(res,200,"Coupon Found Successfull",coupon)
})

// Get All Coupon
exports.GetAllCoupon = asyncHandler(async(req,res)=>{
    const coupon = await couponModel.find()
    if (!coupon) {
        throw new customError(401,"Coupon Not Found !!")
    }
    apiResponse.sendSucces(res,200,"Coupon Found Successfull",coupon)
})

// Update Coupon
exports.UpdateCoupon = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Slug Missing !!")
    }
    const coupon = await couponModel.findOneAndUpdate(
        {slug},
        { ...req.body },
        { new : true }
    )
    if (!coupon) {
        throw new customError(500,"Coupon Not Updated  !!")
    }
    apiResponse.sendSucces(res,200,"Coupon Updated Successfully",coupon)
})

// Delete Coupon
exports.DeleteCoupon = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Slug Missing !!")
    }
    const coupon = await couponModel.findOneAndDelete({slug})
    if (!coupon) {
        throw new customError(500,"Coupon Not Deleted  !!")
    }
    apiResponse.sendSucces(res,200,"Coupon Deleted Successfully",coupon)
})

// Status Update Coupon
exports.UpdateStatusCoupon = asyncHandler(async(req,res)=>{
    const { status,slug } = req.query
    if (!slug && !status) {
        throw new customError(401,"Slug Or Status Missing !!")
    }
    let query = {}
    if (status == "active") {    // condition
        query.isActive = true
    }else{
        query.isActive = false
    }
    const coupon = await couponModel.findOneAndUpdate(
        {slug},
        { isActive : query.isActive },
        { new: true }
    )
    if (!coupon) {
        throw new customError(500,"Coupon Status Not Updated !!")
    }
    apiResponse.sendSucces(res,200,"Coupon Status Update Successfull",coupon)
})