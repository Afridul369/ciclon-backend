const exprees = require('express')
const _ = exprees.Router()
const orderController = require('../../controller/order.controller')

_.route('/create-order').post(orderController.CreateOrder)

module.exports = _