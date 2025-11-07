require("dotenv").config();
const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { validateOrder } = require("../validation/order.validation");
// Models
const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const deliveryChargeModel = require("../models/deliveryCharge.model");
const productModel = require("../models/product.model");
const variantModel = require("../models/variant.model");
const invoiceModel = require("../models/invoiceId.model");
const { getTransactionId, GetProductName } = require("../helper/uniqueid");
// Payment Related
const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = process.env.NODE_ENV == "development" ? false : true;

// FUNCTIONS
// deliveryCharge Function
const deliveryChargeFunction = async (deliveryCharge) => {
  return await deliveryChargeModel.findById(deliveryCharge);
};

//Create Order
exports.CreateOrder = asyncHandler(async (req, res) => {
  const value = await validateOrder(req);
  const { user, guestId, shippinginfo, deliveryCharge, paymentMethod } = value;
  if (!user && !guestId) throw new customError(401, "User Or GuestId Missing");
  if (!paymentMethod) throw new customError(401, "PaymentMethod Missing");
  const query = user ? { userId: user } : { guestId: guestId };
  let order = null;
  const cart = await cartModel.findOne(query);
  // fetch the items
  const productInfo = await Promise.all(
    cart.items.map((eachitem) => {
      if (eachitem.product) {
        return productModel
          .findOneAndUpdate(
            { _id: eachitem.product },
            {
              $inc: { stock: -eachitem.quantity, totalSale: eachitem.quantity },
            }
          )
          .select("-QrCode -barCode -updatedAt -reviews -tag");
      }
      if (eachitem.variant) {
        return variantModel
          .findOneAndUpdate(
            { _id: eachitem.variant },
            {
              $inc: {
                stockVariant: -eachitem.quantity,
                totalSale: eachitem.quantity,
              },
            },
            { new: true }
          )
          .select("-QrCode -barCode -updatedAt -reviews -tag");
      }
    })
  );
  // set the items in order
  order = await new orderModel({
    user,
    guestId,
    items: productInfo,
    shippinginfo,
  });
  order.deliveryCharge = deliveryCharge;
  order.coupon = cart.coupon;
  order.discountAmount = cart.discountPrice;
  // Calculate Delivery Charge
  const charge = await deliveryChargeFunction(deliveryCharge);
  order.finalAmount = cart.totalAmountOfWholeProduct + charge.amount;
  order.deliveryZone = charge.name;
  // Get Transaction Id
  const transactId = getTransactionId();
  order.transactionId = transactId;
  // Make a Invoice id
  const invoiceInstance = await invoiceModel.create({
    invoiceId: order.transactionId,
    order: order._id,
  });
  // Get Product Name
  const productName = GetProductName(order.items);
  // Payment Information
  if (paymentMethod === "cod") {
    order.paymentMethod = "cod";
    order.paymentStatus = "Pending";
    order.invoiceId = invoiceInstance.invoiceId;
    order.totalQuantity = cart.totalproduct;
    await order.save();
    apiResponse.sendSucces(res, 200, "Order Created Successfully (COD)", order);
  }
  if (paymentMethod == "online") {
    const data = {
      total_amount: 100,
      currency: "BDT",
      tran_id: order.transactionId, // use unique tran_id for each api call
      success_url: `${process.env.DOMAIN_URL}${process.env.BASE_URL}/success`,
      // success_url: `process.env.DOMAIN_URL/process.env.BASE_URL/success`,
      fail_url: `${process.env.DOMAIN_URL}${process.env.BASE_URL}/fail`,
      cancel_url: `${process.env.DOMAIN_URL}${process.env.BASE_URL}/cancel`,
      ipn_url: `${process.env.DOMAIN_URL}${process.env.BASE_URL}/ipn`,
      shipping_method: "Courier",
      product_name: productName,
      product_category: "Electronic",
      product_profile: "general",
      cus_name: shippinginfo.firstname,
      cus_email: shippinginfo.email,
      cus_add1: shippinginfo.address,
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: shippinginfo.phone,
      cus_fax: shippinginfo.phone,
      ship_name: shippinginfo.firstname,
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "Bangladesh",
    };
    try {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const response = await sslcz.init(data);
      order.paymentMethod = "online";
      order.paymentStatus = "Pending";
      order.invoiceId = invoiceInstance.invoiceId;
      order.totalQuantity = cart.totalproduct;
      console.log(response);
      await order.save();
      apiResponse.sendSucces(res, 200, "Easy Checkout Url", {
        url: response.GatewayPageURL,
      });
    } catch (error) {
      await Promise.all(
        cart.items.map((eachitem) => {
          if (eachitem.product) {
            return productModel.findOneAndUpdate(
              { _id: eachitem.product },
              {
                $inc: {
                  stock: eachitem.quantity,
                  totalSale: -eachitem.quantity,
                },
              }
            );
          }
          if (eachitem.variant) {
            return variantModel.findOneAndUpdate(
              { _id: eachitem.variant },
              {
                $inc: {
                  stockVariant: eachitem.quantity,
                  totalSale: -eachitem.quantity,
                },
              }
            );
          }
        })
      );
      // Delete InvoiceId
      await invoiceModel.findOneAndDelete({ invoiceId: order.invoiceId });
      throw new customError(500, `Payment Initiat Failed ${error}`);
    }
  }
});

// Get All Order
exports.GetAllOrder = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  const allOrder = await orderModel
    .find(
      phoneNumber
        ? { "shippinginfo.phone": { $regex: phoneNumber, $options: "i" } }
        : {}
    )
    .sort({ createdAt: -1 });
  if (!allOrder) {
    throw new customError(404, "Order Not Found !!");
  }
  apiResponse.sendSucces(res, 200, "All Order Found Successfullt", allOrder);
});

// Get All Order Status
exports.GetAllOrderStatus = asyncHandler(async (req, res) => {
  const orderStatus = await orderModel.aggregate([
    {
      $group: {
        _id: "$orderStatus", //  grouping all status
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: "$count" }, // counting overall order
        breakdown: {
          $push: {
            // storing status & count in an array
            orderStatus: "$_id",
            count: "$count",
          },
        },
      },
    },
    {
      $project: {
        // formating the output except _id
        _id: 0,
        totalOrders: 1,
        breakdown: 1,
      },
    },
  ]);
  apiResponse.sendSucces(res, 200, "Orders Found Successfully", orderStatus);
});

// Update Order Status
exports.UpdateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new customError(404, "Id Is Missing !!");
  const { status } = req.body;
  const updateStatus = await orderModel.findOneAndUpdate(
    { _id: id },
    { orderStatus: status },
    { new: true }
  );
  if (!updateStatus) throw new customError(500, "Order Status Not Updated !!");
  apiResponse.sendSucces(res,200,"Order Status Updated Successfully", updateStatus)
});

// Get All CourierPending
exports.GetAllCourierPending = asyncHandler(async(req,res)=>{
    const allCourierPending = await orderModel.find(
      { orderStatus : 'CourierPending' }
    )
    if (!allCourierPending) {
       throw new customError(500,"No CourierPending ORder Status Found")
    }
    apiResponse.sendSucces(res,200,"All Courier Pending Order Status Retrive Successfull", allCourierPending)
})

