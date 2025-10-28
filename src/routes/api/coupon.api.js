const exprees = require('express')
const _ = exprees.Router()
const CouponController = require('../../controller/coupon.controller')

_.route('/create-coupon').post(CouponController.CreateCoupon) 
_.route('/single-coupon/:slug').get(CouponController.getSingleCoupon) 
_.route('/all-coupon').get(CouponController.GetAllCoupon) 
_.route('/update-coupon/:slug').put(CouponController.UpdateCoupon) 
_.route('/delete-coupon/:slug').delete(CouponController.DeleteCoupon) 
_.route('/status-update-coupon').put(CouponController.UpdateStatusCoupon) 


module.exports = _