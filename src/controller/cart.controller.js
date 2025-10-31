const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const cartModel = require('../models/cart.model');
const productModel = require('../models/product.model');
const couponModel = require('../models/coupon.model');
const variantModel = require('../models/variant.model');
const { validateCart } = require("../validation/cart.validation");

// Apply Coupon
const applyCoupon = async (coupon,totalAmout) => {
    let afterCouponUse = 0;
    let couponDiscountAmount = 0;
    let couponCode;
    try {
        const couponCode = await couponModel.findOne({code:coupon})
        if(!couponCode) throw new customError(401,"Coupon Code Is InValid")
        const {usedCount,usageLimit,isActive,createdAt,discountType,discountValue} = couponCode
        if (createdAt >= new Date() && isActive == false) {
            throw new customError(401,"Coupon Expired !!")
        }
        if (usageLimit < usedCount) {
            throw new customError(401,"Coupon Limit Expired !!")
        }
        if (discountType == "percentance") {
            couponDiscountAmount = Math.ceil((totalAmout * discountValue) / 100)
            afterCouponUse =  Math.ceil(totalAmout - couponDiscountAmount)
        }
        if (discountType == "tk") {
            afterCouponUse = Math.ceil(totalAmout - discountValue)

        }
        couponCode.usedCount += 1
        await couponCode.save()
        return {
            couponCode,
            afterCouponUse,
            couponDiscountAmount
        }
    } catch (error) {
        if (couponCode) { 
            await couponModel.findOneAndUpdate({code : coupon}, { usedCount : usedCount - 1 })
        }
        console.log("Error From Apply Coupon", error);
    }
}

// AddToCart
exports.AddToCart = asyncHandler(async(req,res)=>{
    const {userId,guestId,productId,variantId,color,size,quantity } = await validateCart(req)
    let query = userId ? {userId} : {guestId}
    let cart = {}
    let product = {}
    let variant = {}
    // let promiseArr = [];
    let price = 0;

    if (productId) {
        product = await productModel.findById(productId)
        price = product.retailPrice
    }
    if (variantId) {
        variant = await variantModel.findById(variantId)
        price = variant.retailPrice
    }
    cart = await cartModel.findOne(query)
    if (!cart) {
        cart = new cartModel({
            userId : userId,
            guestId : guestId,
            items : [{
                product : productId || null,
                variant : variantId || null,
                quantity : quantity,
                price : productId ? price : price,
                unitTotalPrice: productId ? Math.floor(price * quantity) : Math.floor(price * quantity) , // productid or variantid price would be counted
                size,
                color
                }]
            })
        }else{
            const findItemIndex = cart.items.findIndex((cartitem)=> 
                cartitem.product?.toString() == productId || cartitem.variant?.toString() == variantId
            )
            if (findItemIndex >= 0) {
                cart.items[findItemIndex].quantity += quantity || 1
                cart.items[findItemIndex].unitTotalPrice = cart.items[findItemIndex].price * cart.items[findItemIndex].quantity
            }else{
                cart.items.push({
                product : productId || null,
                variant : variantId || null,
                quantity : quantity,
                price : productId ? price : price,
                unitTotalPrice: productId ? Math.floor(price * quantity) : Math.floor(price * quantity) , // productid or variantid price would be counted
                size,
                color
                })
            }
        }
        const totalCartInfo = cart.items.reduce((acc,item)=>{
                acc.totalProduct += item.quantity
                acc.totalPrice += item.unitTotalPrice
                return acc
        },{
            totalProduct : 0,
            totalPrice : 0,
        })
        cart.totalAmountOfWholeProduct = totalCartInfo.totalPrice
        cart.totalproduct = totalCartInfo.totalProduct
    await cart.save()
    apiResponse.sendSucces(res,200,'AddToCart Successfull',cart)  
})

// Apply Coupon 
exports.ApplyCoupon = asyncHandler(async(req,res)=>{
    const {coupon, userId , guestId} = req.body  // to use a coupon coupon field & atleast id is needed who is in the cart
    if (!coupon ) {
        throw new customError(401,"Your Coupon Is Missing")
    }
    if (!userId && !guestId ) {
        throw new customError(401,"ID Is Missing")
    }
    const query = userId ? {userId} : {guestId}
    const cart = await cartModel.findOne(query) // find the user who has already a cart
    // console.log(query);
    // console.log(cart);
    // console.log(userId);
    // return
    //  De-Structure the data from ApplyCoupon Function And Apply
    const {couponCode, afterCouponUse, couponDiscountAmount} = await applyCoupon(coupon,cart.totalAmountOfWholeProduct) // send the coupon Code (Not Slug) & the total Amount
    cart.coupon = couponCode._id   //
    cart.totalAmountOfWholeProduct = afterCouponUse
    cart.discountPrice = couponDiscountAmount
    cart.discountType = couponCode.discountType
    // SAVE Cart Database
    await cart.save()
    apiResponse.sendSucces(res,201,"Coupon Apply Done Successfully",cart)
})