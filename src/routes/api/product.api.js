const express = require('express')
const _ = express.Router()
const productController = require('../../controller/product.controller')
const upload = require('../../middleware/multer.middleware')

_.route('/create-product').post(upload.fields([{name:'image',maxCount:5}]) ,productController.CreateProduct)
_.route('/all-product').get(productController.GetAllProducts)
_.route('/single-product/:slug').get(productController.GetSingleProduct)

module.exports = _