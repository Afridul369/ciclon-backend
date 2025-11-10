const exprees = require('express')
const _ = exprees.Router()
const CourierController = require('../../controller/courier.controller')

_.route('/create-courier').post(CourierController.CreateCourier)
_.route('/bulk-order').post(CourierController.CreateBulkCourier)
_.route('/delivery-status').get(CourierController.DeliveryStatus)
_.route('/current-balance').get(CourierController.CheckCurrentBalance)
_.route('/return-request').post(CourierController.ReturnRequest)
_.route('/single-return-request').get(CourierController.GetSingleReturnRequest)
_.route('/all-return-request').get(CourierController.GetAllReturnRequest)

module.exports = _