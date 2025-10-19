const exprees = require('express')
const _ = exprees.Router()
const categoryController = require('../../controller/category.controller')
const upload = require('../../middleware/multer.middleware')


_.route('/create_category').post(upload.fields([{name:"image",maxCount:1}]),categoryController.createCategory)
_.route('/get_all_category').get(categoryController.get_all_category)
_.route('/category_by_slug/:slug').get(categoryController.categoryBySlug)
_.route('/update_single_category/:slug').put(upload.fields([{name:"image",maxCount:1}]),categoryController.updateSingleCategory)



module.exports = _