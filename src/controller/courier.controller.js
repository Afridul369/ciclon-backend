const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const orderModel = require('../models/order.model')
const { api } = require("../helper/axios");
const { default: mongoose } = require("mongoose");


// Create Courier
exports.CreateCourier = asyncHandler(async(req,res)=>{
    const { orderId } = req.body
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new customError(404,"Order ID Is Not Valid !!")
    }
    const order = await orderModel.findById(orderId)
    if (!order) {
        throw new customError(500,"Order Not found !!")
    }
    const { invoiceId,shippinginfo,finalAmount } = order
    const courierPayload = {
        invoice : invoiceId,
        recipient_name : shippinginfo.firstname,
        recipient_phone : shippinginfo.phone,
        recipient_email : shippinginfo.email || null,
        recipient_address : shippinginfo.address,
        cod_amount : finalAmount,
        note : 'Deliver Urgent'
    }
    const response = await api.post('/create_order',courierPayload)
    if (!response.data || response.data.status !== 200) {
        throw new customError(500,"Create Order Failed !!")
    }
    const { consignment } = response.data
    order.courier.name = 'SteadFast',
    order.courier.trackingId = consignment.tracking_code
    order.courier.rawResponse = consignment
    order.courier.status = consignment.status
    await order.save()
    apiResponse.sendSucces(res,200,"Courier Order Created Successfull",{
        trackingId : consignment.tracking_code,
        message : response.data.message,
        consignment
    })
})

// Create Bulk Order
exports.CreateBulkCourier = asyncHandler(async (req, res) => {
    const { orderIds } = req.body;
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
        throw new customError(400, "Please provide an array of Order IDs!");
    }
    const results = [];
    for (const orderId of orderIds) {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
        results.push({
            orderId,
            success: false,
            message: "Invalid Order ID"
        });
        continue;
        }
    const order = await orderModel.findById(orderId);
    if (!order) {
      results.push({
        orderId,
        success: false,
        message: "Order not found"
      });
      continue;
    }
    const { invoiceId, shippinginfo, finalAmount } = order;
    const courierPayload = {
      invoice: invoiceId,
      recipient_name: shippinginfo.firstname,
      recipient_phone: shippinginfo.phone,
      recipient_email: shippinginfo.email || null,
      recipient_address: shippinginfo.address,
      cod_amount: finalAmount,
      note: 'Deliver Urgent'
    };
    try {
      const response = await api.post('/create_order', courierPayload);
      if (!response.data || response.data.status !== 200) {
        results.push({
          orderId,
          success: false,
          message: "Courier API failed"
        });
        continue;
      }
      const { consignment } = response.data;
      // Save courier info to order
      order.courier.name = 'SteadFast';
      order.courier.trackingId = consignment.tracking_code;
      order.courier.rawResponse = consignment;
      order.courier.status = consignment.status;
      await order.save();
      results.push({
        orderId,
        success: true,
        trackingId: consignment.tracking_code,
        message: response.data.message,
        consignment
      });

    } catch (error) {
      results.push({
        orderId,
        success: false,    // if orderID is inValid Or In not database
        message: error.message || "Unknown error"
      });
    }
  }
    apiResponse.sendSucces(res, 200, "Bulk courier orders processed", results);
});

// Checking Delivery Status
exports.DeliveryStatus  = asyncHandler(async(req,res)=>{
    const { trackingCode } = req.body
    const response = await api.get(`/status_by_trackingcode/${trackingCode}`)
    if (!response.data || response.data.status !== 200) {
        throw new customError(500,"Failed To Retrive Delivery Status")
    }
    apiResponse.sendSucces(res,200,"Delivery Status Retrieve Successfull",response.data)
})

// Checking Current Balance
exports.CheckCurrentBalance = asyncHandler(async(req,res)=>{
    const response = await api.get('/get_balance')   
    if (!response.data || response.data.status !== 200) {
        throw new customError(500,"Failed To Retrive Delivery Status")
    }
    apiResponse.sendSucces(res,200,'Your Current Balance Fetched Successfull',response.data)
})

// Create Return Request 
exports.ReturnRequest = asyncHandler(async(req,res)=>{
    const { consignment_id } = req.body
    if (!consignment_id) {
        throw new customError(404,"consignment_id Is Required !!")
    }
    const response = await api.post('/create_return_request',{
        consignment_id,
        reason : 'Customer Request'
    })
    if (!response.data) {
        throw new customError(500,"Return Request Create Failed !!")
    }
    const order = await orderModel.findOne({
        invoiceId : response.data.consignment.invoice
    })
    if (!order) {
        throw new customError(500,"Order Not Found !!")
    }
    order.returnStatus = "Requested",
    order.returnId = response.data.id,
    order.returnStatusHistory = response.data,
    order.orderStatus = response.data.status
    // finally order saving
    await order.save()
    apiResponse.sendSucces(res,200,"Return Request Created Succesfull")
})

// Single Return Request By Id
exports.GetSingleReturnRequest = asyncHandler(async(req,res)=>{
    const { returnID } = req.query
    if (!returnID) {
        throw new customError(404,"Return ID Is Missing !!")
    }

    const response = await api.get(`/get_return_request/${returnID}`)
    if (!response.data) {
        throw new customError(400,"No Return Request Order Found")
    }
    apiResponse.sendSucces(res,200,"Return Request Fetched Successfull",response.data)

})

// Get All Return Request
exports.GetAllReturnRequest = asyncHandler(async(req,res)=>{
    const response = await api.get('/get_return_requests')
    if (!response) {
        throw new customError(404,"There Is No Return Request")
    }
    apiResponse.sendSucces(res,200,"All Return Request fetched Successfull",response.data)
})