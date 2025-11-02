const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { validateDeliveryCharge } = require("../validation/deliveryCharge.validation");
const deliveryChargeModel = require('../models/deliveryCharge.model')


// Create deliveryCharge
exports.CreateDeliveryCharge = asyncHandler(async(req,res)=>{
    const value = await validateDeliveryCharge(req)
    const deliveryCharge = await deliveryChargeModel.create({...value}).sort(createdAt -1)
    if (!deliveryCharge) {
        throw new customError(401,"DeliveryCharge not created")
    }
    apiResponse.sendSucces(res,200,"DeliveryCharge Created Done",deliveryCharge)
})

// Get All Charges
exports.GetAllCharges = asyncHandler(async(req,res)=>{
    const deliveryCharge = await deliveryChargeModel.find().sort(createdAt -1)
    if (!deliveryCharge) {
        throw new customError(401,"DeliveryCharge Not Found")
    }
    apiResponse.sendSucces(res,200,"All DliveryCharges Found Successfully",deliveryCharge)
})

// Get Single DeliveryCharge
exports.GetSingleDeliveryCharge = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Slug Not Found")
    }
    const deliveryCharge = await deliveryChargeModel.findOne({slug:slug})
    if (!deliveryCharge) {
        throw new customError(401,"deliveryCharge Not Found")
    }
    apiResponse.sendSucces(res,200,"DliveryCharge Found Successfully",deliveryCharge)
})

// Update DeliveryCharge 
exports.UpdateDeliveryCharge = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    const data = req.body
    for (const parts in data) {
        if (data[parts] === "" || data[parts] === undefined || data[parts] === null) {
            throw new customError(401,"Please Insert all fields")
        } 
    }
    if (!slug) {
        throw new customError(401,"Slug Not Found")
    }

    const deliveryCharge = await deliveryChargeModel.findOneAndUpdate(
        {slug},
        {...data},
        {new:true}
    )
    if (!deliveryCharge) {
        throw new customError(401,"deliveryCharge Not Found")
    }
    apiResponse.sendSucces(res,200,"DeliveryCharge Update successfull",deliveryCharge)
})

// Delete Delivery Charge
exports.DeleteDeliVeryCharge = asyncHandler(async(req,res)=>{
    const {slug} = req.params
     if (!slug) {
        throw new customError(401,"Slug Not Found")
    }
    const deliveryCharge = await deliveryChargeModel.findOneAndDelete({slug})
    if (!deliveryCharge) {
        throw new customError(401,"deliveryCharge Not Found")
    }
    apiResponse.sendSucces(res,200,"DeliveryCharge Deleted successfull",deliveryCharge)
})