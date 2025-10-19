const exprees = require('express')
const _ = exprees.Router()
const BrandController = require('../../controller/brand.controller')
const upload = require('../../middleware/multer.middleware')

_.route('/create-brand').post(upload.fields([{name:'image',maxCount:1}]), BrandController.CreateBrand)
_.route('/all-brand').get(BrandController.GetAllBrand)
_.route('/single-brand/:slug').get(BrandController.GetSingleBrand)
_.route('/delete-brand/:slug').delete(BrandController.DeleteBrand)

module.exports = _