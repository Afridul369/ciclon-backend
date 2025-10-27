const express = require('express')
const _ = express.Router()
const productController = require('../../controller/product.controller')
const upload = require('../../middleware/multer.middleware')

_.route('/create-product').post(upload.fields([{name:'image',maxCount:5}]) ,productController.CreateProduct)
_.route('/all-product').get(productController.GetAllProducts)
_.route('/single-product/:slug').get(productController.GetSingleProduct)
_.route('/update-productinfo/:slug').put(productController.UpdateProductInfo)
_.route('/uplodad-productimage/:slug').put(upload.fields([{name:'image',maxCount:5}]) ,productController.UploadproductImage)
_.route('/delete-productimage/:slug').delete(productController.DeleteProductImage)
_.route('/search-product').get(productController.SearchProducts)
_.route('/product-pagination').get(productController.Productpagination)
_.route('/product-pricerange').get(productController.PriceRange)
_.route('/product-sorting').get(productController.ProductOrderOrSort)
_.route('/product-delete/:slug').delete(productController.ProductDelete)
_.route('/product-mode').get(productController.ProductMode)

module.exports = _