const exprees = require('express')
const _ = exprees.Router()
const orderController = require('../../controller/order.controller')

_.route('/create-order').post(orderController.CreateOrder)
_.route('/allorder').get(orderController.GetAllOrder)
_.route('/getallorders').get(orderController.GetAllOrderStatus)
_.route('/updatestatus/:id').put(orderController.UpdateOrderStatus)
_.route('/getcourierpending').get(orderController.GetAllCourierPending)

module.exports = _