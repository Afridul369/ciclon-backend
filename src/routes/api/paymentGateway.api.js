const exprees = require('express')
const _ = exprees.Router()
const paymentGatewayController = require('../../controller/paymentGateway.Controller')

_.route('/success').post(paymentGatewayController.Success)
_.route('/fail').post(paymentGatewayController.fail)
_.route('/cancel').post(paymentGatewayController.cancel)
_.route('/ipn').post(paymentGatewayController.ipn)

module.exports = _