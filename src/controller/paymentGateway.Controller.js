const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const orderModel = require('../models/order.model')
// Payment 
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "development" ? false : true;


// Success
exports.Success = asyncHandler(async(req,res)=>{
    const {val_id} = req.body
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    const validatePayment = await sslcz.validate({
        val_id
    })
    console.log('validate',validatePayment);
    if (!validatePayment.status === "VALID") {
        throw new customError(500,"Payment Not Valid")
    }
    await orderModel.findOneAndUpdate(
        {transactionId : validatePayment.tran_id},
        {paymentStatus : validatePayment.status ? 'VALID' :  "Success"}
    )
    apiResponse.sendSucces(res,200,"Payment Suxccessfull" , null)
})

// Failed
exports.fail = asyncHandler(async(req,res)=>{
    res.status(301).redirect("https://github.com/Afridul369/ciclon-backend")
})

// Cancel
exports.cancel = asyncHandler(async(req,res)=>{
    res.status(301).redirect("https://github.com/Afridul369/ciclon-backend")
})

// Ipn
exports.ipn = asyncHandler(async(req,res)=>{
    res.status(301).redirect("https://github.com/Afridul369/ciclon-backend")
})


