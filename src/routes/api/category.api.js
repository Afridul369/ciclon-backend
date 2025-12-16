const exprees = require('express')
const _ = exprees.Router()
const categoryController = require('../../controller/category.controller')
const upload = require('../../middleware/multer.middleware')
const { AuthGuard } = require('../../middleware/authguard.middleware')


_.route('/create_category').post(AuthGuard, upload.fields([{name:"image",maxCount:1}]),categoryController.createCategory)
_.route('/get_all_category').get(categoryController.get_all_category)
_.route('/category_by_slug/:slug').get(categoryController.categoryBySlug)
_.route('/update_single_category/:slug').put(upload.fields([{name:"image",maxCount:1}]),categoryController.updateSingleCategory)
_.route('/delete_category/:slug').delete(categoryController.deleteCategory)



module.exports = _