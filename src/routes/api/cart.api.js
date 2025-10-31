const exprees = require('express')
const _ = exprees.Router()
const CartController = require('../../controller/cart.controller')

_.route('/addtocart').post(CartController.AddToCart)
_.route('/applycoupon').post(CartController.ApplyCoupon)

module.exports = _