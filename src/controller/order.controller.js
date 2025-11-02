const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { validateOrder } = require("../validation/order.validation");
const orderModel = require('../models/order.model')
const cartModel = require('../models/cart.model')
const productModel = require('../models/product.model')
const variantModel = require('../models/variant.model')

//Create Order 
exports.CreateOrder = asyncHandler(async(req,res)=>{
    const value = await validateOrder(req)
    const { user, guestId, shippinginfo, deliveryCharge } = value
    if (!user && !guestId) throw new customError(401,"User Or GuestId Missing")
    const query = user ? {user} : {guestId}
    let order = null;
    const cart = await cartModel.findOne(query)
    const productInfo = await Promise.all(
        cart.items.map((eachitem)=> {
            if (eachitem.product) {
                return productModel.findOneAndUpdate(
                    { _id : eachitem.product },
                    { $inc : { stock : -eachitem.quantity , totalSale : eachitem.quantity } }
                )
            }
            if (eachitem.variant) {
                return variantModel.findOneAndUpdate(
                    { _id : eachitem.variant },
                    { $inc : { stockVariant : -eachitem.quantity , totalSale : eachitem.quantity } }
                )
            }
        })
    )

    console.log(productInfo);
})