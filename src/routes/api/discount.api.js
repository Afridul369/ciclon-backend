const exprees = require('express')
const _ = exprees.Router()
const DiscountController = require('../../controller/discount.controller')

_.route('/create-discount').post(DiscountController.CreateDiscount)
_.route('/getall-discount').get(DiscountController.GetAllDiscount)
_.route('/single-discount/:slug').get(DiscountController.GetSingleDiscount)
_.route('/update-discount/:slug').put(DiscountController.UpdateDiscount)
_.route('/delete-discount/:slug').delete(DiscountController.DeleteDiscount)

module.exports = _