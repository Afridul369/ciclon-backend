const exprees = require('express')
const _ = exprees.Router()

_.use('/auth', require('./api/user.api'))
_.use('/category', require('./api/category.api'))
_.use('/subcategory', require('./api/subCategory.api'))
_.use('/brand', require('./api/brand.api'))
_.use('/discount', require('./api/discount.api'))
_.use('/product', require('./api/product.api'))
_.use('/variant', require('./api/variant.api'))
_.use('/coupon', require('./api/coupon.api'))
_.use('/cart', require('./api/cart.api'))
_.use('/deliverycharge', require('./api/deliveryCharge.api'))
_.use('/order', require('./api/order.api'))
_.use('/payment', require('./api/paymentGateway.api'))

module.exports = _